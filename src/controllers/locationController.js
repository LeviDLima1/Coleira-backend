const db = require('../models');
const Location = db.Location;
const Pet = db.Pet; // Importar modelo Pet
const User = db.User; // Importar modelo User
const SafeZone = db.SafeZone; // Importar modelo SafeZone
const Alert = db.Alert; // Importar modelo Alert

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

exports.receiveLocationData = async (req, res) => {
    try {
        console.log('📦 Dados de localização recebidos:', req.body);

        // Assumindo que o corpo da requisição contém:
        // { petId: number, latitude: number, longitude: number, batteryLevel?: number, status?: string }
        const { petId, latitude, longitude, batteryLevel, status } = req.body;

        // TODO: Adicionar validação dos dados recebidos mais robusta
        if (!petId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Dados de localização incompletos.'
            });
        }

        // Salvar os dados na tabela locations
        const newLocation = await Location.create({
            pet_id: petId, // Usar pet_id para corresponder ao nome da coluna no DB
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date(), // Usar a data/hora atual do servidor ao receber
            battery_level: batteryLevel,
            status: status,
        });

        console.log('✅ Localização salva no DB:', newLocation);

        // --- Lógica de verificação de Zona Segura e Criação de Alerta ---
        let petStatus = 'Localizado'; // Status padrão se não houver zonas ou verificação

        try {
            // 1. Encontrar o pet para obter o user_id
            const pet = await Pet.findByPk(petId);

            if (pet) {
                // 2. Buscar zonas seguras do usuário dono do pet
                const safeZones = await SafeZone.findAll({
                    where: { user_id: pet.userId },
                });

                console.log(`🔍 Encontradas ${safeZones.length} zonas seguras para o usuário ${pet.userId}.`);

                if (safeZones.length > 0) {
                    let insideAnyZone = false;
                    for (const zone of safeZones) {
                        if (isInsideSafeZone(latitude, longitude, zone.center_latitude, zone.center_longitude, zone.radius)) {
                            insideAnyZone = true;
                            console.log(`✅ Pet ${petId} está DENTRO da zona segura: ${zone.name || zone.id}`);
                            petStatus = 'Dentro da Zona Segura';
                            // Se estiver dentro de QUALQUER zona, consideramos seguro
                            break; // Sai do loop assim que encontrar uma zona
                        }
                    }

                    if (!insideAnyZone) {
                        console.log(`❌ Pet ${petId} está FORA de TODAS as zonas seguras.`);
                        petStatus = 'Fora da Zona Segura';

                        // TODO: Melhorar a lógica para evitar alertas duplicados frequentes (ex: verificar se um alerta recente já existe para saída da zona)

                        // Criar registro de alerta no banco de dados
                        try {
                            await Alert.create({
                                pet_id: petId,
                                type: 'Saída da Zona Segura',
                                message: `O pet ${pet.name || pet.id} saiu da zona segura.`,
                                latitude: latitude,
                                longitude: longitude,
                                timestamp: new Date(),
                                is_resolved: false,
                            });
                            console.log('🚨 Alerta de saída da zona segura criado para o pet:', petId);
                        } catch (alertError) {
                            console.error('❌ Erro ao criar alerta:', alertError);
                            // Não re-lançar para não falhar o salvamento da localização
                        }
                    }
                } else {
                    console.log(`ℹ️ Nenhuma zona segura definida para o usuário ${pet.userId}.`);
                    petStatus = 'Sem Zona Segura Definida';
                }
            } else {
                console.log(`⚠️ Pet com ID ${petId} não encontrado para verificar zonas seguras.`);
                petStatus = 'Pet Não Encontrado';
            }
        } catch (zoneError) {
            console.error('❌ Erro geral na lógica de zona segura:', zoneError);
            petStatus = `Erro ao verificar Zona Segura`;
        }

        // Opcional: Atualizar o status da localização recém-criada com o resultado da verificação
        // await newLocation.update({ status: petStatus });
        // Considere se você quer guardar o status da zona para CADA ponto de localização ou apenas ter um status GERAL do pet.
        // Para um status geral, você pode atualizar o modelo Pet ou ter um cache.
        // Por enquanto, vamos apenas logar e criar o alerta, e o frontend buscará o status ao obter a última localização/detalhes do pet.

        res.status(201).json({
            success: true,
            message: 'Dados de localização recebidos e salvos com sucesso.',
            data: {
                ...newLocation.toJSON(), // Retornar os dados da localização
                zoneStatus: petStatus // Incluir o status da zona na resposta (opcional)
            }
        });

    } catch (error) {
        console.error('❌ Erro ao receber/salvar dados de localização:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 