import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export async function escucharEventos() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Nos conectamos al mismo buzón que usa Auth
    await channel.assertExchange("taskflow_eventos", "fanout", { durable: false });
    
    // Creamos una cola exclusiva para este servicio
    const q = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(q.queue, "taskflow_eventos", "");

    console.log("🐰 Tareas escuchando eventos de RabbitMQ...");

    // Aquí se queda escuchando los mensajes que lleguen
    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        const { evento, datos } = JSON.parse(msg.content.toString());
        console.log(`📥 Evento recibido: ${evento}`, datos);
        
        if (evento === "usuario.creado") {
          console.log(`👋 ¡Bienvenido al sistema, ${datos.nombre}!`);
        }
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("❌ Error RabbitMQ (Tareas):", error.message);
  }
}