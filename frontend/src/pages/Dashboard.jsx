import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
  });

  const [projects, setProjects] = useState([]);

  const [tasks, setTasks] = useState([]);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
  });

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await API.get(
        `/tasks/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);

      setSelectedProject(projectId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();

    fetchStats();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleMemberChange = (e) => {
    setMemberForm({
      ...memberForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Project Created");

      setForm({
        name: "",
        description: "",
      });

      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/tasks",
        {
          ...taskForm,
          projectId: selectedProject,
          assignedToId: JSON.parse(
            atob(token.split(".")[1])
          ).id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task Created");

      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
      });

      fetchTasks(selectedProject);

      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const createMember = async () => {
    try {
      await API.post(
        "/auth/create-member",
        memberForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Member created successfully");

      setMemberForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to create member"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}

      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Team Task Manager
        </h1>

        <div className="flex items-center gap-4">
          <span className="bg-white text-blue-600 px-4 py-1 rounded-full font-semibold">
            {role?.toUpperCase()}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">
          Dashboard
        </h2>

        {/* Analytics */}

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Total Tasks
            </h3>

            <p className="text-3xl font-bold">
              {stats.totalTasks}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Completed
            </h3>

            <p className="text-3xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              In Progress
            </h3>

            <p className="text-3xl font-bold text-yellow-600">
              {stats.inProgress}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Todo
            </h3>

            <p className="text-3xl font-bold text-blue-600">
              {stats.todo}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Overdue
            </h3>

            <p className="text-3xl font-bold text-red-600">
              {stats.overdue}
            </p>
          </div>
        </div>

        {/* Admin Create Member */}

        {role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h3 className="text-2xl font-semibold mb-4">
              Create Member
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Member Name"
              value={memberForm.name}
              onChange={handleMemberChange}
              className="w-full border p-3 rounded mb-4"
            />

            <input
              type="email"
              name="email"
              placeholder="Member Email"
              value={memberForm.email}
              onChange={handleMemberChange}
              className="w-full border p-3 rounded mb-4"
            />

            <input
              type="password"
              name="password"
              placeholder="Member Password"
              value={memberForm.password}
              onChange={handleMemberChange}
              className="w-full border p-3 rounded mb-4"
            />

            <button
              onClick={createMember}
              className="bg-green-600 text-white px-6 py-3 rounded"
            >
              Create Member
            </button>
          </div>
        )}

        {/* Create Project */}

        <form
          onSubmit={handleCreateProject}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >
          <h3 className="text-2xl font-semibold mb-4">
            Create Project
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
          />

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Create Project
          </button>
        </form>

        {/* Projects */}

        <div>
          <h3 className="text-2xl font-semibold mb-4">
            My Projects
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((item) => (
              <div
                key={item.project.id}
                className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  fetchTasks(item.project.id)
                }
              >
                <h4 className="text-xl font-bold mb-2">
                  {item.project.name}
                </h4>

                <p className="text-gray-600">
                  {item.project.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}

        {selectedProject && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">
              Tasks
            </h3>

            {/* Create Task */}

            <form
              onSubmit={handleCreateTask}
              className="bg-white p-6 rounded-xl shadow mb-6"
            >
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={taskForm.title}
                onChange={handleTaskChange}
                className="w-full border p-3 rounded mb-4"
              />

              <textarea
                name="description"
                placeholder="Task Description"
                value={taskForm.description}
                onChange={handleTaskChange}
                className="w-full border p-3 rounded mb-4"
              />

              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleTaskChange}
                className="w-full border p-3 rounded mb-4"
              />

              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleTaskChange}
                className="w-full border p-3 rounded mb-4"
              >
                <option value="LOW">LOW</option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">HIGH</option>
              </select>

              <button
                className="bg-green-600 text-white px-6 py-3 rounded"
              >
                Create Task
              </button>
            </form>

            {/* Tasks List */}

            <div className="grid md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-6 rounded-xl shadow"
                >
                  <h4 className="text-xl font-bold">
                    {task.title}
                  </h4>

                  <p className="text-gray-600 mt-2">
                    {task.description}
                  </p>

                  <div className="mt-4">
                    <select
                      value={task.status}
                      onChange={async (e) => {
                        try {
                          await API.put(
                            `/tasks/${task.id}`,
                            {
                              status:
                                e.target.value,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          fetchTasks(
                            selectedProject
                          );

                          fetchStats();
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                      className="border px-3 py-2 rounded"
                    >
                      <option value="TODO">
                        TODO
                      </option>

                      <option value="IN_PROGRESS">
                        IN PROGRESS
                      </option>

                      <option value="DONE">
                        DONE
                      </option>
                    </select>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    Priority: {task.priority}
                  </div>

                  <div className="mt-2 text-sm text-gray-500">
                    Due:{" "}
                    {new Date(
                      task.dueDate
                    ).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;