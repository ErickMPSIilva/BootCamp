import * as Yup from 'yup';
import Students from '../models/Students';
import User from '../models/Users';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    const { email } = req.body;

    const userExists = await Students.findOne({ where: { email } });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Error!' });
    }

    if (userExists) {
      return res.status(401).json({ error: 'User already exist' });
    }

    const { id, name, age, weight, height } = await Students.create(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Error!' });
    }

    const { name, email, age, weight, height } = req.body;

    await User.findByPk(req.userId);

    const student = await Students.findOne({ where: { name } });

    if (email !== student.email && email !== undefined) {
      const emailExist = await Students.findOne({ where: { email } });
      if (emailExist) {
        return res.status(400).json({ error: 'This email already exist!' });
      }
    }

    const { id } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentsController();
