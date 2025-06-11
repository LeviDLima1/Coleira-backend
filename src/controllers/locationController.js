const db = require('../models');
const Location = db.Location;
const Pet = db.Pet;
const User = db.User;
const SafeZone = db.SafeZone;
const Alert = db.Alert;
const { sendSafeZoneAlertNotification } = require('../services/notificationService');

// Função auxiliar para calcular a distância entre dois pontos geográficos (fórmula de Haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180; // φ, λ em radianos
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // Distância em metros
    return d;
}

// Função para verificar se um ponto está dentro de uma zona circular
function isInsideSafeZone(pointLat, pointLon, zoneLat, zoneLon, zoneRadius) {
    const distance = haversineDistance(pointLat, pointLon, zoneLat, zoneLon);
    return distance <= zoneRadius;
}

// Função para verificar se um ponto está dentro de uma zona segura
function isPointInSafeZone(point, safeZone) {
    const distance = haversineDistance(
        point.latitude,
        point.longitude,
        safeZone.center_latitude,
        safeZone.center_longitude
    );
    return distance <= safeZone.radius;
}

// Função para receber dados de localização do ESP32
async function receiveLocationData(req, res) {
    try {
        console.log('📦 Dados de localização recebidos:', req.body);
        console.log('🔑 Headers:', req.headers);
        console.log('🔑 Headers (lowercase):', Object.keys(req.headers).reduce((acc, key) => {
            acc[key.toLowerCase()] = req.headers[key];
            return acc;
        }, {}));

        const { latitude, longitude } = req.body;
        const deviceId = req.headers['x-device-id'];

        if (!deviceId) {
            console.log('❌ Device ID não fornecido');
            return res.status(400).json({
                success: false,
                error: 'Device ID não fornecido no cabeçalho X-Device-ID'
            });
        }

        console.log('🔍 Procurando pet com device_id:', deviceId);
        console.log('🔍 Device ID type:', typeof deviceId);
        console.log('🔍 Device ID length:', deviceId.length);

        // Encontrar o pet associado ao device_id
        const pet = await Pet.findOne({ where: { device_id: deviceId } });
        if (!pet) {
            console.log('❌ Pet não encontrado para device_id:', deviceId);
            // Listar todos os pets para debug
            const allPets = await Pet.findAll();
            console.log('📋 Todos os pets:', allPets.map(p => ({ id: p.id, device_id: p.device_id })));
            return res.status(404).json({
                success: false,
                error: 'Pet não encontrado para o device_id fornecido'
            });
        }

        console.log('✅ Pet encontrado:', pet.name);

        // Salvar a localização
        const location = await Location.create({
            pet_id: pet.id,
            latitude,
            longitude,
            timestamp: new Date(),
        });

        console.log('✅ Localização salva no DB:', location.id);

        // Buscar zonas seguras do usuário
        const safeZones = await SafeZone.findAll({
            where: { user_id: pet.user_id },
        });

        console.log(`🔍 Encontradas ${safeZones.length} zonas seguras para o usuário ${pet.user_id}.`);

        // Verificar se o pet está dentro de alguma zona segura
        let isInSafeZone = false;
        for (const safeZone of safeZones) {
            if (isPointInSafeZone({ latitude, longitude }, safeZone)) {
                isInSafeZone = true;
                console.log(`✅ Pet ${pet.name} está DENTRO da zona segura: ${safeZone.name || safeZone.id}`);
                break;
            }
        }

        // Se o pet não estiver em nenhuma zona segura, criar um alerta
        if (!isInSafeZone) {
            console.log(`❌ Pet ${pet.name} está FORA de TODAS as zonas seguras.`);
            // Verificar se já existe um alerta recente (últimos 5 minutos)
            const recentAlert = await Alert.findOne({
                where: {
                    pet_id: pet.id,
                    type: 'safe_zone',
                    is_resolved: false,
                    timestamp: {
                        [db.Sequelize.Op.gte]: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
                    },
                },
            });

            if (!recentAlert) {
                // Criar novo alerta
                const alert = await Alert.create({
                    pet_id: pet.id,
                    type: 'safe_zone',
                    message: `${pet.name} saiu da zona segura!`,
                    latitude,
                    longitude,
                    timestamp: new Date(),
                    is_resolved: false,
                });

                // Buscar o usuário para obter o token de notificação
                const user = await User.findByPk(pet.user_id);
                if (user && user.pushToken) {
                    // Enviar notificação push
                    await sendSafeZoneAlertNotification(
                        user.pushToken,
                        pet.name,
                        latitude,
                        longitude
                    );
                }
            }
        }

        res.status(201).json({
            success: true,
            message: 'Dados de localização recebidos e salvos com sucesso.',
            data: {
                ...location.toJSON(),
                zoneStatus: isInSafeZone ? 'Dentro da Zona Segura' : 'Fora da Zona Segura'
            }
        });

    } catch (error) {
        console.error('❌ Erro ao receber/salvar dados de localização:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.receiveLocationData = receiveLocationData; 