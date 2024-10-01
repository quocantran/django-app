"use client";
import React, { useEffect, useState } from "react";
import { IResume } from "@/types/backend";
import { fetchResumes } from "@/config/api";
import Access from "@/components/admin/Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import ResumeTable from "@/components/admin/Resumes/Resume.table";
import { useSearchParams } from "next/navigation";

const Resumes = (props: any) => {
  const param = useSearchParams();
  const current = (param.get("page") as unknown as number) || 1;
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchResumes(current);
      setResumes(res?.data?.result || []);
      setMeta(res?.data?.meta);
      setLoading(false);
    };

    fetchData();
  }, [current, reload]);

  return (
    <Access permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}>
      <div>
        <ResumeTable
          meta={meta}
          resumes={resumes ? resumes : []}
          reload={reload}
          setReload={setReload}
          loading={loading}
          setResumes={setResumes}
          current={current}
        />
      </div>
    </Access>
  );
};

export default Resumes;
