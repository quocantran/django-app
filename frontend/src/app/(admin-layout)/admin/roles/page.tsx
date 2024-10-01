"use client";
import React, { useEffect, useState } from "react";
import { IRole } from "@/types/backend";
import { fetchRoles } from "@/config/api";
import Access from "@/components/admin/Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import RoleTable from "@/components/admin/Role/Role.table";
import { useSearchParams } from "next/navigation";

const Roles = (props: any) => {
  const param = useSearchParams();
  const current = (param.get("page") as unknown as number) || 1;
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchRoles(current);
      setRoles(res?.data?.result || []);
      setMeta(res?.data?.meta);
      setLoading(false);
    };

    fetchData();
  }, [current, reload]);

  return (
    <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
      <div>
        <RoleTable
          meta={meta}
          roles={roles ? roles : []}
          reload={reload}
          setReload={setReload}
          loading={loading}
          setRoles={setRoles}
          current={current}
        />
      </div>
    </Access>
  );
};

export default Roles;
