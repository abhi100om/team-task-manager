const prisma = require("../utils/prisma");

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      assignedToId,
      projectId,
    } = req.body;

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
        message: "Only admin can create tasks",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        assignedToId,
        projectId,
        createdById: req.user.id,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const member = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: req.user.id,
      },
    });

    if (!member) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,

        ...(req.user.role === "member"
          ? {
            assignedToId: req.user.id,
          }
          : {}),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const { status } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isAdmin =
      task.project.adminId === req.user.id;

    const isAssigned =
      task.assignedToId === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.project.adminId !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can delete tasks",
      });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.json({
      message: "Task deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};