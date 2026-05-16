const prisma = require("../utils/prisma");

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        adminId: req.user.id,
      },
    });

    await prisma.projectMember.create({
      data: {
        userId: req.user.id,
        projectId: project.id,
        role: "ADMIN",
      },
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.projectMember.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        project: true,
      },
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;

    const projectId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    const existingMember =
      await prisma.projectMember.findFirst({
        where: {
          userId: user.id,
          projectId,
        },
      });

    if (existingMember) {
      return res.status(400).json({
        message: "User already in project",
      });
    }

    const member = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId,
        role: "MEMBER",
      },
    });

    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (project.adminId !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can remove members",
      });
    }

    await prisma.projectMember.deleteMany({
      where: {
        projectId: id,
        userId,
      },
    });

    res.json({
      message: "Member removed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};