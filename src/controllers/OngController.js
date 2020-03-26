import crypto from "crypto";
import connection from "../database/connection";

class OngController {
  async index(req, res) {
    const ongs = await connection("ongs").select("*");

    return res.json(ongs);
  }

  async store(req, res) {
    try {
      const { name, email, whatsapp, city, uf } = req.body;

      const ongExists = await connection("ongs")
        .where("name", name)
        .select("name")
        .first();

      if (ongExists) {
        return res.status(400).json({ error: "This ONG already exists" });
      }

      const id = crypto.randomBytes(4).toString("HEX");

      await connection("ongs").insert({
        id,
        name,
        email,
        whatsapp,
        city,
        uf
      });

      return res.json({ name, id });
    } catch (error) {
      return res.status(404).json({ message: "Bad Request" });
    }
  }

  async delete(req, res) {
    await connection("ongs")
      .where("id", req.params.id)
      .delete();

    return res.json("Ong deletada");
  }
}

export default new OngController();
