const Role = require("../models/Role");

const seedRoles = async () => {
  try {
    const roles = [
      { name: "user", permissions: ["view_tasks", "update_own_tasks"] },
      { name: "manager", permissions: ["view_tasks", "assign_tasks", "view_reports"] },
      { name: "admin", permissions: ["view_tasks", "manage_users", "assign_tasks", "view_reports"] }
    ];

    for (let role of roles) {
      const exists = await Role.findOne({ name: role.name });
      if (!exists) {
        await Role.create(role);
        console.log(`Role '${role.name}' created`);
      } else {
        console.log(`Role '${role.name}' already exists`);
      }
    }
  } catch (err) {
    console.error("Error seeding roles:", err);
  }
};

module.exports = seedRoles;
