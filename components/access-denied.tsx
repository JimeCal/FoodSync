"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AccessDeniedProps {
  description: string;
  href?: string;
  title?: string;
}

export function AccessDenied({
  description,
  href = "/dashboard",
  title = "No tienes permisos para acceder aqui",
}: AccessDeniedProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-xl">
        <Card className="border-[#F5841F]/30">
          <CardContent className="p-6 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5841F]/15">
              <Lock className="h-8 w-8 text-[#F5841F]" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <Link href={href}>
              <Button className="mt-6 bg-[#3D7F35] hover:bg-[#346B2D]">
                Volver
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
