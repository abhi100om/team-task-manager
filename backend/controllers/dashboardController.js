const prisma = require("../utils/prisma");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await prisma.task.count();

    const completed = await prisma.task.count({
      where: {
        status: "DONE",
      },
    });

    const inProgress = await prisma.task.count({
      where: {
        status: "IN_PROGRESS",
      },
    });

    const todo = await prisma.task.count({
      where: {
        status: "TODO",
      },
    });

    const overdue = await prisma.task.count({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: "DONE",
        },
      },
    });

    res.json({
      totalTasks,
      completed,
      inProgress,
      todo,
      overdue,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};