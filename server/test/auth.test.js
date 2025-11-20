const request = require("supertest");
const app = require("./utils/testServer");
const db = require("./utils/testDb");
const User = require("../models/user");

beforeAll(async () => { await db.connect(); });
afterEach(async () => { await db.clearDatabase(); });
afterAll(async () => { await db.closeDatabase(); });

describe("POST /api/register", () => {

  test("Debe registrar un usuario correctamente", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        nombre: "Juan",
        apellido: "Test",
        email: "test@test.com",
        password: "123456",
        password2: "123456",
        telephone: "611111111"
      });

    expect(res.status).toBe(201);
    expect(res.body.msg).toBe("Usuario registrado correctamente");

    const user = await User.findOne({ email: "test@test.com" });
    expect(user).not.toBeNull();
  });

  test("Debe fallar si el email es inválido", async () => {
    const res = await request(app).post("/api/register").send({
      nombre: "Mal",
      apellido: "Correo",
      email: "correo_mal",
      password: "123456",
      password2: "123456",
      telephone: "611111111"
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Formato de email no válido");
  });

  test("Debe fallar si las contraseñas no coinciden", async () => {
    const res = await request(app).post("/api/register").send({
      nombre: "Juan",
      apellido: "Perez",
      email: "correo@test.com",
      password: "123456",
      password2: "777777",
      telephone: "611111111"
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Las contraseñas no coinciden");
  });

  test("Debe fallar si ya existe un usuario con ese email", async () => {
    await User.create({
      nombre: "Repetido",
      apellido: "Uno",
      email: "duplicado@test.com",
      password: "123456",
      telephone: "611111111"
    });

    const res = await request(app).post("/api/register").send({
      nombre: "Repetido",
      apellido: "Dos",
      email: "duplicado@test.com",
      password: "123456",
      password2: "123456",
      telephone: "622222222"
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("El correo ya está registrado");
  });

});

describe("POST /api/login", () => {

  test("Debe iniciar sesión correctamente", async () => {
    await request(app).post("/api/register").send({
      nombre: "Juan",
      apellido: "Login",
      email: "login@test.com",
      password: "123456",
      password2: "123456",
      telephone: "611111111"
    });

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "login@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("Inicio de sesión correcto");
    expect(res.body.token).toBeDefined();
  });

  test("Debe fallar si la contraseña es incorrecta", async () => {
    await User.create({
      nombre: "Juan",
      apellido: "MalPass",
      email: "bad@test.com",
      password: "123456",
      telephone: "611111111"
    });

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "bad@test.com",
        password: "333333"
      });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Contraseña incorrecta");
  });

  test("Debe fallar si el usuario no existe", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "noexiste@test.com",
        password: "123456"
      });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Usuario no encontrado");
  });

});
