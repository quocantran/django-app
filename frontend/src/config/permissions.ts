export const ALL_PERMISSIONS = {
  COMPANIES: {
    GET_PAGINATE: {
      method: "GET",
      api_path: "/api/v1/companies",
      module: "COMPANIES",
    },
    CREATE: {
      method: "POST",
      api_path: "/api/v1/companies",
      module: "COMPANIES",
    },
    UPDATE: {
      method: "PATCH",
      api_path: "/api/v1/companies/:id",
      module: "COMPANIES",
    },
    DELETE: {
      method: "DELETE",
      api_path: "/api/v1/companies/:id",
      module: "COMPANIES",
    },
  },
  JOBS: {
    GET_PAGINATE: { method: "GET", api_path: "/api/v1/jobs", module: "JOBS" },
    CREATE: { method: "POST", api_path: "/api/v1/jobs", module: "JOBS" },
    UPDATE: { method: "PATCH", api_path: "/api/v1/jobs/:id", module: "JOBS" },
    DELETE: { method: "DELETE", api_path: "/api/v1/jobs/:id", module: "JOBS" },
  },
  PERMISSIONS: {
    GET_PAGINATE: {
      method: "GET",
      api_path: "/api/v1/permissions",
      module: "PERMISSIONS",
    },
    CREATE: {
      method: "POST",
      api_path: "/api/v1/permissions",
      module: "PERMISSIONS",
    },
    UPDATE: {
      method: "PATCH",
      api_path: "/api/v1/permissions/:id",
      module: "PERMISSIONS",
    },
    DELETE: {
      method: "DELETE",
      api_path: "/api/v1/permissions/:id",
      module: "PERMISSIONS",
    },
  },
  RESUMES: {
    GET_PAGINATE: {
      method: "GET",
      api_path: "/api/v1/resumes",
      module: "RESUMES",
    },
    CREATE: { method: "POST", api_path: "/api/v1/resumes", module: "RESUMES" },
    UPDATE: {
      method: "PATCH",
      api_path: "/api/v1/resumes/:id",
      module: "RESUMES",
    },
    DELETE: {
      method: "DELETE",
      api_path: "/api/v1/resumes/:id",
      module: "RESUMES",
    },
  },
  ROLES: {
    GET_PAGINATE: { method: "GET", api_path: "/api/v1/roles", module: "ROLES" },
    CREATE: { method: "POST", api_path: "/api/v1/roles", module: "ROLES" },
    UPDATE: { method: "PATCH", api_path: "/api/v1/roles/:id", module: "ROLES" },
    DELETE: {
      method: "DELETE",
      api_path: "/api/v1/roles/:id",
      module: "ROLES",
    },
  },
  USERS: {
    GET_PAGINATE: { method: "GET", api_path: "/api/v1/users", module: "USERS" },
    CREATE: { method: "POST", api_path: "/api/v1/users", module: "USERS" },
    UPDATE: { method: "PATCH", api_path: "/api/v1/users/:id", module: "USERS" },
    DELETE: {
      method: "DELETE",
      api_path: "/api/v1/users/:id",
      module: "USERS",
    },
  },
};

export const ALL_MODULES = {
  COMPANIES: "COMPANIES",
  JOBS: "JOBS",
  PERMISSIONS: "PERMISSIONS",
  RESUMES: "RESUMES",
  ROLES: "ROLES",
  USERS: "USERS",
};
