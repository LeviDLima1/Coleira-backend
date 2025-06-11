#include <WiFiManager.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>
#include <HTTPClient.h>

//Configuração do chat e token do telegram
const char* botToken = "7749384218:AAGzJU3AKAwNKbW7_Qj7tkuEAimK899l5sE";
const char* chatID = "1471373395";

WiFiClientSecure client;
UniversalTelegramBot bot(botToken, client);

TinyGPSPlus gps;
HardwareSerial gpsSerial(1);

// Configuração do servidor backend
const char* serverUrl = "http://192.168.1.2:3000";

const char* status = "Desconectado";
unsigned long previousMillis = 0;
const long reconnectionInterval = 30000;
unsigned long lastReconnectAttempt = 0;
String deviceId;

//Flag para evitar envio repetido de alerta
bool foraDaCerca = false;  

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17);

  Serial.println("Iniciando Coleira Inteligente...");

  //Conexão Wifi com WiFiManager
  WiFiManager wifiManager;
  wifiManager.autoConnect("ColeiraSmartAP");

  Serial.println("Wi-Fi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  status = "Conectado";

  //Obtém o endereço MAC da placa APÓS a conexão WiFi estar estabelecida
  deviceId = WiFi.macAddress();
  deviceId.replace(":", "");
  Serial.print("Device ID: ");
  Serial.println(deviceId);

  client.setInsecure();
}

void loop() {
  //Verifica conexão Wifi
  if (WiFi.status() != WL_CONNECTED) {
    unsigned long currentMillis = millis();
    if (currentMillis - lastReconnectAttempt >= reconnectionInterval) {
      Serial.println("Wi-Fi desconectado! Tentando reconectar...");
      WiFi.begin();

      unsigned long startAttemptTime = millis();

      while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
        delay(500);
        Serial.print(".");
      }

      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nReconectado com sucesso!");
        Serial.print("IP: ");
        Serial.println(WiFi.localIP());
        status = "Conectado";
        
        //Atualiza o device_id após reconexão
        deviceId = WiFi.macAddress();
        deviceId.replace(":", "");
        Serial.print("Device ID atualizado: ");
        Serial.println(deviceId);
      } else {
        Serial.println("\nFalha na reconexão.");
      }

      lastReconnectAttempt = currentMillis;

      //Reinicia ESP após 10 minutos sem conexão
      if (millis() > 600000) {
        Serial.println("Sem conexão por muito tempo! Reiniciando ESP32...");
        ESP.restart();
      }
    }
  }

  //Leitura do GPS e envio de localização
  while (gpsSerial.available() > 0) {
    char c = gpsSerial.read();
    gps.encode(c);

    if (gps.location.isUpdated()) {
      double lat = gps.location.lat();
      double lon = gps.location.lng();

      Serial.println("----- Localização Atual -----");
      Serial.print("Latitude: ");
      Serial.println(lat, 6);
      Serial.print("Longitude: ");
      Serial.println(lon, 6);
      Serial.print("Status do Wi-Fi: ");
      Serial.println(status);
      Serial.print("Device ID: ");
      Serial.println(deviceId);
      Serial.println("----------------------------");

      // Envia a localização para o backend
      enviarLocalizacaoApp(lat, lon);
    }
  }

  //Evita sobrecarga no loop
  delay(500);
}

//Função para enviar alerta no Telegram
void enviarAlertaTelegram(double lat, double lon, double distancia) {
  if (WiFi.status() == WL_CONNECTED) {
    String mensagem = "ALERTA! O pet saiu da área segura!\n";
    mensagem += "Localização:\n";
    mensagem += "Lat: " + String(lat, 6) + "\n";
    mensagem += "Lon: " + String(lon, 6) + "\n";
    mensagem += "Distância: " + String(distancia, 2) + " m";

    if (bot.sendMessage(chatID, mensagem, "")) {
      Serial.println("Alerta enviado ao Telegram!");
    } else {
      Serial.println("Falha ao enviar alerta ao Telegram.");
    }
  } else {
    Serial.println("Sem Wi-Fi! Não foi possível enviar alerta.");
  }
}

void enviarLocalizacaoApp(float lat, float lon) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Monta a URL completa
    String url = String(serverUrl) + "/api/locations/receive";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Device-ID", deviceId);

    //Montar o payload JSON
    String payload = "{";
    payload += "\"latitude\":";
    payload += String(lat, 6);
    payload += ",";
    payload += "\"longitude\":";
    payload += String(lon, 6);
    payload += "}";

    //Enviar a requisição POST
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("Código de resposta HTTP: ");
      Serial.println(httpResponseCode);
      String resposta = http.getString();
      Serial.println("Resposta: " + resposta);
      
      // Verifica se o pet está fora da zona segura
      if (resposta.indexOf("Fora da Zona Segura") != -1) {
        enviarAlertaTelegram(lat, lon, 0); // A distância será calculada pelo backend
      }
    } else {
      Serial.print("Erro no envio: ");
      Serial.println(http.errorToString(httpResponseCode));
    }
    //Libera recursos
    http.end();
  } else {
    Serial.println("WiFi não conectado");
  }
} 