export interface IBackendRes<T> {
  statusCode: number | string;
  message?: string;
  error?: string;
  data?: T;
}

export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface IChat {
  id?: string;
  file_url?: string;
  content: string;
  user?: {
    id: string;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAccount {
  access_token: string;
  user: {
    id?: int;
    email: string;
    name: string;
    role: {
      id?: int;
      name: string;
    };
    permissions: {
      id?: int;
      name: string;
      api_path: string;
      method: string;
      module: string;
    }[];
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface ICompany {
  id?: int;
  name: string;
  address: string;
  logo?: string;
  description?: string;
  users_followed?: string[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface IUser {
  id?: int;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  address: string;
  role?: {
    id?: int;
    name: string;
  };

  company?: {
    id?: int;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface IJob {
  id?: int;
  name: string;
  skills: string[];
  company?: {
    id?: int;
    name: string;
    logo?: string;
    address?: string;
  };
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  start_date: Date;
  end_date: Date;
  is_active?: boolean;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface IResume {
  id?: int;
  email: string;
  userId: string;
  url: string;
  status: string;
  company: {
    id?: int;
    name: string;
    logo: string;
  };
  job: {
    id?: int;
    name: string;
  };

  history?: {
    status: string;
    updated_at: Date;
    updatedBy: { id?: int; email: string };
  }[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateResume {
  url: string;
  company: string;
  job: string;
}

export interface IPermission {
  id?: string;
  name: string;
  api_path: string;
  method: string;
  module: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface IRole {
  id?: string;
  name: string;
  description: string;
  is_active: boolean;
  permissions: IPermission[] | int[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface IUpdateUserPassword {
  password: string;
  newPassword: string;
  repeatedPassword: string;
}

export interface IJobSuggest {
  name: string;
  location: string;
}

export interface ISubscribers {
  id?: int;
  email: string;
  skills: string[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface IFile {
  url: string;
}

export interface IComment {
  id?: int;
  content: string;
  user: {
    id?: int;
    name: string;
  };
  company: {
    id?: int;
    name: string;
  };
  parent: string;
  left: number;
  right: number;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateComment {
  content: string;
  parentid?: int;
  companyid: string;
}
