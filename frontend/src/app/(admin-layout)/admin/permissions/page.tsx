"use client";
import React, { useEffect, useState } from "react";
import { IPermission } from "@/types/backend";
import { fetchPermissions } from "@/config/api";
import Access from "@/components/admin/Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import PermissionTable from "@/components/admin/Permission/Permisson.table";
import { useSearchParams } from "next/navigation";

const Permission = (props: any) => {
  const param = useSearchParams();
  const current = (param.get("page") as unknown as number) || 1;
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchPermissions(current);
      setPermissions(res?.data?.result || []);
      setMeta(res?.data?.meta);
      setLoading(false);
    };

    fetchData();
  }, [current, reload]);

  return (
    <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}>
      <div>
        <PermissionTable
          meta={meta}
          permissions={permissions ? permissions : []}
          reload={reload}
          setReload={setReload}
          loading={loading}
          setPermissons={setPermissions}
          current={current}
        />
      </div>
    </Access>
  );
};

export default Permission;
