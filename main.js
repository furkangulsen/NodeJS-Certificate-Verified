const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

const brokerAddress = 'localhost';
const port = 8883;

const caCert 	 = fs.readFileSync(path.join(__dirname, 'ca.crt'));
const clientCert = fs.readFileSync(path.join(__dirname, 'client.crt'));
const clientKey  = fs.readFileSync(path.join(__dirname, 'client.key'));

const options = 
{
  port: port,
  protocol: 'mqtts',
  ca: caCert,
  //rejectUnauthorized: false, // Kendinden imzalı sertifikalar için sertifika doğrulamasını devre dışı bırakıyoruz
  cert: clientCert,
  key: clientKey,
};

const client = mqtt.connect(`mqtts://${brokerAddress}`, options);

client.on('connect', () => 
{
  console.log('Broker\'a bağlandı.');

  const topic = 'mesajlar';
  const message = 'Merhaba, bu bir MQTT mesajıdır!';

  client.publish(topic, message, (error) => {
    if (!error) {
      console.log('Mesaj başarıyla gönderildi.');
    } else {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  });
});

client.on('message', (topic, message) => 
{
  console.log('Alınan mesaj:', message.toString());
});

const subscribeTopic = 'mesajlar';
client.subscribe(subscribeTopic);

process.on('SIGINT', () => 
{
  console.log('Program sonlandırılıyor...');
  client.end(() => {
    process.exit();
  });
});