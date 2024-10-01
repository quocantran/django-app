"use client";
import React, { useEffect, useState } from "react";
import UserTable from "@/components/admin/User/User.table";
import { IBackendRes, IModelPaginate, IUser } from "@/types/backend";
import { fetchUsers } from "@/config/api";
import Access from "@/components/admin/Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useSearchParams } from "next/navigation";

const User = (props: any) => {
  const param = useSearchParams();
  const current = (param.get("page") as unknown as number) || 1;
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchUsers(current);
      setUsers(data?.data?.result || []);
      setMeta(data?.data?.meta);
      setLoading(false);
    };

    fetchData();
  }, [current, reload]);

  return (
    <Access permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}>
      <div>
        <UserTable
          meta={meta}
          users={users ? users : []}
          reload={reload}
          setReload={setReload}
          loading={loading}
          setUsers={setUsers}
          current={current}
        />
      </div>
    </Access>
  );
};

export default User;
