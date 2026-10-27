import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

let channel;

export async function conectarRabbit() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Creamos el buzón principal donde viajarán los eventos
    await channel.assertExchange("taskflow_eventos", "fanout", { durable: false });
    console.log("🐰 Conectado a RabbitMQ desde Auth");
  } catch (error) {
    console.error("❌ Error RabbitMQ (Auth):", error.message);
  }
}

export async function publicarEvento(evento, datos) {
  if (!channel) {
    console.log("⚠️ No se puede publicar, RabbitMQ no está conectado.");
    return;
  }
  
  // Publicamos el evento con sus datos
  channel.publish("taskflow_eventos", "", Buffer.from(JSON.stringify({ evento, datos })));
  console.log(`📤 Evento publicado: ${evento}`);
}