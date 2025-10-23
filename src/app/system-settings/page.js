"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Send,
  AlertTriangle,
  CheckSquare,
  Square,
  FileText,
  User,
  Calendar,
  MapPin,
  Shield,
  Cpu,
  Cable,
  Camera,
  Eye,
  Zap,
  BarChart3,
  Database,
  Brain,
  ScanLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";

export default function SystemSettingsPage() {


  return (
    <LayoutDashboard activeMenu={3}>
    </LayoutDashboard>
  );
}
