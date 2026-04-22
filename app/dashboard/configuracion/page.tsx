"use client";

import { useState } from "react";
import { PermissionGate } from "@/components/permission-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/lib/user-context";
import { plans } from "@/lib/mock-data";
import { 
  ArrowLeft,
  Check,
  X,
  User,
  Building,
  CreditCard,
  Bell,
  Shield,
  Crown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Building2,
  Users
} from "lucide-react";
import Link from "next/link";

type PlanId = "basic" | "plus" | "premium";

interface PlanFeatures {
  dailyRecommendation: boolean;
  weeklyReport: boolean;
  historicalData: boolean;
  advancedPrediction: boolean;
  multiLocation: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
}

const planFeatures: Record<PlanId, PlanFeatures> = {
  basic: {
    dailyRecommendation: true,
    weeklyReport: true,
    historicalData: false,
    advancedPrediction: false,
    multiLocation: false,
    apiAccess: false,
    prioritySupport: false,
    customIntegrations: false,
  },
  plus: {
    dailyRecommendation: true,
    weeklyReport: true,
    historicalData: true,
    advancedPrediction: true,
    multiLocation: false,
    apiAccess: false,
    prioritySupport: true,
    customIntegrations: false,
  },
  premium: {
    dailyRecommendation: true,
    weeklyReport: true,
    historicalData: true,
    advancedPrediction: true,
    multiLocation: true,
    apiAccess: true,
    prioritySupport: true,
    customIntegrations: true,
  },
};

const featureLabels: Record<keyof PlanFeatures, string> = {
  dailyRecommendation: "Recomendacion diaria de produccion",
  weeklyReport: "Informe semanal por email",
  historicalData: "Acceso a datos historicos (90 dias)",
  advancedPrediction: "Prediccion avanzada con ML",
  multiLocation: "Gestion multi-local",
  apiAccess: "Acceso a API",
  prioritySupport: "Soporte prioritario",
  customIntegrations: "Integraciones personalizadas",
};

const planOrder: PlanId[] = ["basic", "plus", "premium"];

export default function ConfiguracionPage() {
  const { user, updateUser, updateNotifications, changePlan, changeSubscriptionType } = useUser();
  
  const [activeTab, setActiveTab] = useState<"perfil" | "planes" | "notificaciones">("perfil");
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [changeConfirmed, setChangeConfirmed] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  // Form states
  const [formName, setFormName] = useState(user.name);
  const [formEmail, setFormEmail] = useState(user.email);
  const [formBusinessName, setFormBusinessName] = useState(user.businessName);
  const [formBusinessType, setFormBusinessType] = useState(user.businessType);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const currentPlan = plans.find(p => p.id === user.plan);
  const currentPlanIndex = planOrder.indexOf(user.plan);

  const tabs = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "planes", label: "Plan", icon: CreditCard },
    { id: "notificaciones", label: "Alertas", icon: Bell },
  ] as const;

  const handleChangePlan = (planId: PlanId) => {
    setSelectedPlan(planId);
    setShowChangeModal(true);
    setChangeConfirmed(false);
  };

  const confirmChangePlan = () => {
    if (selectedPlan) {
      changePlan(selectedPlan);
      setChangeConfirmed(true);
    }
  };

  const closeModal = () => {
    setShowChangeModal(false);
    setSelectedPlan(null);
    setChangeConfirmed(false);
  };

  const getSelectedPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const isUpgrade = (planId: PlanId) => {
    return planOrder.indexOf(planId) > currentPlanIndex;
  };

  const isDowngrade = (planId: PlanId) => {
    return planOrder.indexOf(planId) < currentPlanIndex;
  };

  const handleSaveProfile = () => {
    updateUser({
      name: formName,
      email: formEmail,
    });
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleSaveBusiness = () => {
    updateUser({
      businessName: formBusinessName,
      businessType: formBusinessType,
    });
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleChangePassword = () => {
    setPasswordError("");
    setPasswordSuccess(false);
    
    if (currentPassword !== "demo123") {
      setPasswordError("La contrasena actual es incorrecta");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("La nueva contrasena debe tener al menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contrasenas no coinciden");
      return;
    }
    
    setPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(false);
    }, 2000);
  };

  const handleToggle2FA = () => {
    updateUser({ twoFactorEnabled: !user.twoFactorEnabled });
    setShow2FAModal(false);
  };

  const getFeaturesLost = () => {
    if (!selectedPlan) return [];
    const currentFeatures = planFeatures[user.plan];
    const newFeatures = planFeatures[selectedPlan];
    
    return Object.entries(featureLabels)
      .filter(([key]) => currentFeatures[key as keyof PlanFeatures] && !newFeatures[key as keyof PlanFeatures])
      .map(([, label]) => label);
  };

  const getFeaturesGained = () => {
    if (!selectedPlan) return [];
    const currentFeatures = planFeatures[user.plan];
    const newFeatures = planFeatures[selectedPlan];
    
    return Object.entries(featureLabels)
      .filter(([key]) => !currentFeatures[key as keyof PlanFeatures] && newFeatures[key as keyof PlanFeatures])
      .map(([, label]) => label);
  };

  return (
    <PermissionGate
      permission="manageSettings"
      title="Tu rol no puede abrir configuracion"
      description="Solo el dueno del negocio puede cambiar plan, seguridad y ajustes generales."
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Mensaje guardado */}
      {showSavedMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#3D7F35] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
          <Check className="h-4 w-4" />
          <span className="text-sm">Cambios guardados correctamente</span>
        </div>
      )}
      
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Configuracion
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 border-b border-border pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#3D7F35] text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Perfil Tab */}
      {activeTab === "perfil" && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-5 w-5 text-[#3D7F35]" />
                Informacion personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Nombre completo</Label>
                <Input 
                  id="name" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="text-sm" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="text-sm" 
                />
              </div>
              <Button 
                className="w-full sm:w-auto bg-[#3D7F35] hover:bg-[#346B2D] text-sm"
                onClick={handleSaveProfile}
              >
                Guardar cambios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building className="h-5 w-5 text-[#F5841F]" />
                Informacion del negocio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business" className="text-sm">Nombre del negocio</Label>
                <Input 
                  id="business" 
                  value={formBusinessName}
                  onChange={(e) => setFormBusinessName(e.target.value)}
                  className="text-sm" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm">Tipo de negocio</Label>
                <Input 
                  id="type" 
                  value={formBusinessType}
                  onChange={(e) => setFormBusinessType(e.target.value)}
                  className="text-sm" 
                />
              </div>
              <Button 
                className="w-full sm:w-auto bg-[#3D7F35] hover:bg-[#346B2D] text-sm"
                onClick={handleSaveBusiness}
              >
                Guardar cambios
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Shield className="h-5 w-5 text-[#3D7F35]" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm sm:text-base">Cambiar contrasena</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Actualiza tu contrasena de acceso
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto text-sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Cambiar
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm sm:text-base">Autenticacion de dos factores</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {user.twoFactorEnabled ? "Activado - Tu cuenta esta protegida" : "Anade una capa extra de seguridad"}
                  </p>
                </div>
                <Button 
                  variant={user.twoFactorEnabled ? "default" : "outline"}
                  className={`w-full sm:w-auto text-sm ${user.twoFactorEnabled ? "bg-[#3D7F35] hover:bg-[#346B2D]" : ""}`}
                  onClick={() => setShow2FAModal(true)}
                >
                  {user.twoFactorEnabled ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Planes Tab */}
      {activeTab === "planes" && (
        <div className="space-y-4 sm:space-y-6">
          {/* Subscription Type Selection */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CreditCard className="h-5 w-5 text-[#3D7F35]" />
                Tipo de suscripcion
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Elige si tienes un solo local o varios establecimientos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => changeSubscriptionType("individual")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    user.subscriptionType === "individual"
                      ? "border-[#3D7F35] bg-[#3D7F35]/10"
                      : "border-border hover:border-[#3D7F35]/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      user.subscriptionType === "individual" ? "bg-[#3D7F35]/20" : "bg-muted"
                    }`}>
                      <Users className={`h-5 w-5 ${user.subscriptionType === "individual" ? "text-[#3D7F35]" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Individual</p>
                      <p className="text-xs text-muted-foreground">Un solo establecimiento</p>
                    </div>
                  </div>
                  {user.subscriptionType === "individual" && (
                    <div className="flex items-center gap-1 text-xs text-[#3D7F35]">
                      <Check className="h-3 w-3" />
                      Seleccionado
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => changeSubscriptionType("multilocal")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    user.subscriptionType === "multilocal"
                      ? "border-[#F5841F] bg-[#F5841F]/10"
                      : "border-border hover:border-[#F5841F]/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      user.subscriptionType === "multilocal" ? "bg-[#F5841F]/20" : "bg-muted"
                    }`}>
                      <Building2 className={`h-5 w-5 ${user.subscriptionType === "multilocal" ? "text-[#F5841F]" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Multi-local</p>
                      <p className="text-xs text-muted-foreground">Varios establecimientos</p>
                    </div>
                  </div>
                  {user.subscriptionType === "multilocal" && (
                    <div className="flex items-center gap-1 text-xs text-[#F5841F]">
                      <Check className="h-3 w-3" />
                      Seleccionado - 7EUR descuento/local
                    </div>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Plan */}
          <Card className="border-[#3D7F35]/30 bg-gradient-to-r from-[#3D7F35]/5 to-[#3D7F35]/10">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F5841F]/20 flex items-center justify-center shrink-0">
                    <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-[#F5841F]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Tu plan actual</p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      Plan {currentPlan?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-[#3D7F35]">{currentPlan?.price}EUR</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">/mes</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-[#3D7F35] text-[#3D7F35] text-sm"
                  onClick={() => setShowCompareModal(true)}
                >
                  Comparar planes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan Features */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Funcionalidades de tu plan</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Caracteristicas incluidas en tu Plan {currentPlan?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                {Object.entries(featureLabels).map(([key, label]) => {
                  const hasFeature = planFeatures[user.plan][key as keyof PlanFeatures];
                  return (
                    <div 
                      key={key} 
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                        hasFeature ? 'bg-[#3D7F35]/10' : 'bg-muted/50'
                      }`}
                    >
                      {hasFeature ? (
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#3D7F35] shrink-0" />
                      ) : (
                        <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-xs sm:text-sm ${hasFeature ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Plans Grid */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const planId = plan.id as PlanId;
              const isCurrentPlan = planId === user.plan;
              const isPlanUpgrade = isUpgrade(planId);
              const isPlanDowngrade = isDowngrade(planId);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative transition-all duration-200 ${
                    plan.recommended ? 'border-[#F5841F] shadow-lg shadow-[#F5841F]/10' : ''
                  } ${isCurrentPlan ? 'border-[#3D7F35] bg-[#3D7F35]/5' : ''}`}
                >
                  {plan.recommended && !isCurrentPlan && (
                    <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#F5841F] text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        Recomendado
                      </span>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-2.5 sm:-top-3 right-2 sm:right-4">
                      <span className="bg-[#3D7F35] text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        Actual
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2 pt-6 sm:pt-8">
                    <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                    <div className="mt-3 sm:mt-4">
                      <span className="text-3xl sm:text-4xl font-bold">{plan.price}EUR</span>
                      <span className="text-muted-foreground text-sm">/mes</span>
                    </div>
                    {user.subscriptionType === "multilocal" && (
                      <p className="text-xs text-[#F5841F] mt-1">
                        {plan.price - 7}EUR/local con descuento multi-local
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <ul className="space-y-2 sm:space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#3D7F35] shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {isCurrentPlan ? (
                      <Button variant="outline" className="w-full border-[#3D7F35] text-[#3D7F35] text-sm" disabled>
                        Plan actual
                      </Button>
                    ) : isPlanUpgrade ? (
                      <Button 
                        className="w-full bg-[#3D7F35] hover:bg-[#346B2D] text-sm gap-2"
                        onClick={() => handleChangePlan(planId)}
                      >
                        <ArrowUp className="h-4 w-4" />
                        Mejorar plan
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full text-sm gap-2"
                        onClick={() => handleChangePlan(planId)}
                      >
                        <ArrowDown className="h-4 w-4" />
                        Cambiar plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Multi-local info */}
          {user.subscriptionType === "multilocal" && (
            <Card className="border-[#F5841F]/30 bg-[#F5841F]/5">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5841F]/20 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-[#F5841F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Descuento Multi-local activo</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tienes un descuento de <span className="font-bold text-[#F5841F]">7EUR por local</span> sobre el precio base mensual del plan contratado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Notificaciones Tab */}
      {activeTab === "notificaciones" && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg">Preferencias de notificaciones</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Elige como y cuando quieres recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5 flex-1">
                <p className="font-medium text-sm sm:text-base">Recomendacion diaria</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Recibe cada manana la recomendacion de produccion
                </p>
              </div>
              <Switch
                checked={user.notifications.dailyRecommendation}
                onCheckedChange={() => updateNotifications('dailyRecommendation')}
                className="data-[state=checked]:bg-[#3D7F35] shrink-0"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5 flex-1">
                <p className="font-medium text-sm sm:text-base">Alerta de desperdicio alto</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Aviso cuando el desperdicio supere el 10%
                </p>
              </div>
              <Switch
                checked={user.notifications.highWasteAlert}
                onCheckedChange={() => updateNotifications('highWasteAlert')}
                className="data-[state=checked]:bg-[#3D7F35] shrink-0"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5 flex-1">
                <p className="font-medium text-sm sm:text-base">Informe semanal</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Resumen semanal por email cada lunes
                </p>
              </div>
              <Switch
                checked={user.notifications.weeklyReport}
                onCheckedChange={() => updateNotifications('weeklyReport')}
                className="data-[state=checked]:bg-[#3D7F35] shrink-0"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5 flex-1">
                <p className="font-medium text-sm sm:text-base">Novedades del producto</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Informacion sobre nuevas funcionalidades
                </p>
              </div>
              <Switch
                checked={user.notifications.productNews}
                onCheckedChange={() => updateNotifications('productNews')}
                className="data-[state=checked]:bg-[#3D7F35] shrink-0"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Cambio de Plan con confirmacion */}
      {showChangeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {changeConfirmed ? "Plan actualizado" : "Confirmar cambio de plan"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {changeConfirmed ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-[#3D7F35]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-[#3D7F35]" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    Ahora tienes el Plan {getSelectedPlanDetails()?.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tu nuevo plan ya esta activo.
                  </p>
                  <Button
                    className="mt-6 bg-[#3D7F35] hover:bg-[#346B2D]"
                    onClick={closeModal}
                  >
                    Entendido
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Plan actual</p>
                        <p className="font-semibold">{currentPlan?.name} - {currentPlan?.price}EUR/mes</p>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Nuevo plan</p>
                        <p className="font-semibold text-[#3D7F35]">{getSelectedPlanDetails()?.name} - {getSelectedPlanDetails()?.price}EUR/mes</p>
                      </div>
                    </div>
                  </div>

                  {isDowngrade(selectedPlan) && getFeaturesLost().length > 0 && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-destructive text-sm">Perderas estas funcionalidades:</p>
                          <ul className="mt-2 space-y-1">
                            {getFeaturesLost().map((feature, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <X className="h-3 w-3 text-destructive" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {isUpgrade(selectedPlan) && getFeaturesGained().length > 0 && (
                    <div className="p-4 bg-[#3D7F35]/10 border border-[#3D7F35]/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-[#3D7F35] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#3D7F35] text-sm">Ganaras estas funcionalidades:</p>
                          <ul className="mt-2 space-y-1">
                            {getFeaturesGained().map((feature, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <Check className="h-3 w-3 text-[#3D7F35]" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-center text-muted-foreground">
                    Estas seguro que quieres cambiar de <strong>Plan {currentPlan?.name}</strong> a <strong>Plan {getSelectedPlanDetails()?.name}</strong>?
                  </p>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={closeModal}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className={`flex-1 ${isDowngrade(selectedPlan) ? 'bg-destructive hover:bg-destructive/90' : 'bg-[#3D7F35] hover:bg-[#346B2D]'}`}
                      onClick={confirmChangePlan}
                    >
                      {isDowngrade(selectedPlan) ? 'Confirmar cambio' : 'Mejorar plan'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Comparar Planes */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Comparar planes</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCompareModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Funcionalidad</th>
                      {plans.map(plan => (
                        <th key={plan.id} className={`text-center py-3 px-2 ${plan.id === user.plan ? 'bg-[#3D7F35]/10' : ''}`}>
                          <div className="font-semibold">{plan.name}</div>
                          <div className="text-[#3D7F35] font-bold">{plan.price}EUR</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(featureLabels).map(([key, label]) => (
                      <tr key={key} className="border-b">
                        <td className="py-3 px-2 text-muted-foreground">{label}</td>
                        {plans.map(plan => {
                          const hasFeature = planFeatures[plan.id as PlanId][key as keyof PlanFeatures];
                          return (
                            <td key={plan.id} className={`text-center py-3 px-2 ${plan.id === user.plan ? 'bg-[#3D7F35]/10' : ''}`}>
                              {hasFeature ? (
                                <Check className="h-5 w-5 text-[#3D7F35] mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Cambiar Contrasena */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Cambiar contrasena</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-[#3D7F35]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-[#3D7F35]" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Contrasena actualizada</p>
                  <p className="text-sm text-muted-foreground mt-2">Tu nueva contrasena ya esta activa.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm">Contrasena actual</Label>
                    <Input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Introduce tu contrasena actual"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Nueva contrasena</Label>
                    <Input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimo 6 caracteres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Confirmar nueva contrasena</Label>
                    <Input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la nueva contrasena"
                    />
                  </div>
                  
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Para demo: la contrasena actual es "demo123"
                  </p>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1 bg-[#3D7F35] hover:bg-[#346B2D]" onClick={handleChangePassword}>
                      Cambiar contrasena
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal 2FA */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {user.twoFactorEnabled ? "Desactivar 2FA" : "Activar 2FA"}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShow2FAModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  user.twoFactorEnabled ? 'bg-destructive/20' : 'bg-[#3D7F35]/20'
                }`}>
                  <Shield className={`h-8 w-8 ${user.twoFactorEnabled ? 'text-destructive' : 'text-[#3D7F35]'}`} />
                </div>
                
                {user.twoFactorEnabled ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Estas seguro que quieres desactivar la autenticacion de dos factores? Tu cuenta sera menos segura.
                    </p>
                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" className="flex-1" onClick={() => setShow2FAModal(false)}>
                        Cancelar
                      </Button>
                      <Button className="flex-1 bg-destructive hover:bg-destructive/90" onClick={handleToggle2FA}>
                        Desactivar 2FA
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      La autenticacion de dos factores anade una capa extra de seguridad a tu cuenta. En una app real, aqui escanearias un codigo QR con tu app de autenticacion.
                    </p>
                    <div className="my-4 p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Codigo de configuracion (demo)</p>
                      <p className="font-mono text-lg font-bold tracking-wider mt-1">FOOD-SYNC-2FA-DEMO</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setShow2FAModal(false)}>
                        Cancelar
                      </Button>
                      <Button className="flex-1 bg-[#3D7F35] hover:bg-[#346B2D]" onClick={handleToggle2FA}>
                        Activar 2FA
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </PermissionGate>
  );
}
