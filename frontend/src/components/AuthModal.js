import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// Composants UI simples pour remplacer shadcn
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ className, style, children }) => (
  <div className={`bg-white rounded-lg p-6 max-w-md w-full ${className}`} style={style}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ className, style, children }) => (
  <h2 className={`text-lg font-semibold ${className}`} style={style}>
    {children}
  </h2>
);

const Input = ({ className, style, ...props }) => (
  <input 
    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    style={style}
    {...props}
  />
);

const Label = ({ htmlFor, style, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1" style={style}>
    {children}
  </label>
);

const Button = ({ 
  type = "button", 
  variant = "default", 
  size = "default", 
  disabled = false, 
  className, 
  style, 
  onClick, 
  children 
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2";
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    ghost: "bg-transparent hover:bg-gray-100"
  };
  const sizeClasses = {
    default: "px-4 py-2",
    sm: "px-2 py-1 text-sm"
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const AuthModal = ({ isOpen, onClose, onAuthSuccess, currentTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('tokenType', data.token_type);
        
        setSuccess(isLogin ? 'Connexion réussie !' : 'Inscription réussie !');
        
        // Récupérer les infos utilisateur
        setTimeout(async () => {
          try {
            const profileResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${data.access_token}`,
                'Content-Type': 'application/json'
              }
            });

            if (profileResponse.ok) {
              const userProfile = await profileResponse.json();
              onAuthSuccess({
                token: data.access_token,
                user: userProfile
              });
              onClose();
            }
          } catch (profileError) {
            console.error('Erreur lors de la récupération du profil:', profileError);
          }
        }, 1500);
        
      } else {
        setError(data.detail || 'Une erreur est survenue');
      }
    } catch (fetchError) {
      console.error('Erreur d\'authentification:', fetchError);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      return false;
    }
    if (!formData.password.trim()) {
      return false;
    }
    if (!isLogin && !formData.email.trim()) {
      return false;
    }
    if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      return false;
    }
    if (formData.password.length < 6) {
      return false;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="border-0 backdrop-blur-sm"
        style={{ backgroundColor: currentTheme.cardColor + 'f0' }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-center flex items-center justify-center gap-2"
            style={{ color: currentTheme.primaryColor }}
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? 'Connexion' : 'Inscription'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Messages de retour */}
          {error && (
            <div 
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{ backgroundColor: '#ef444420', color: '#ef4444' }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div 
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{ backgroundColor: '#10b98120', color: '#10b981' }}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom d'utilisateur */}
            <div className="space-y-2">
              <Label htmlFor="username" style={{ color: currentTheme.textColor }}>
                <User className="w-4 h-4 inline mr-2" />
                Nom d&apos;utilisateur
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Votre nom d'utilisateur"
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
                required
              />
            </div>

            {/* Email (inscription seulement) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: currentTheme.textColor }}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    borderColor: currentTheme.primaryColor + '40',
                    color: currentTheme.textColor
                  }}
                  required
                />
              </div>
            )}

            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: currentTheme.textColor }}>
                <Lock className="w-4 h-4 inline mr-2" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 6 caractères"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    borderColor: currentTheme.primaryColor + '40',
                    color: currentTheme.textColor,
                    paddingRight: '2.5rem'
                  }}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: currentTheme.textColor + '80' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {formData.password && formData.password.length < 6 && (
                <p className="text-xs text-red-400">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              )}
            </div>

            {/* Bouton de soumission */}
            <Button 
              type="submit"
              disabled={loading || !validateForm()}
              className="w-full"
              style={{ 
                backgroundColor: validateForm() ? currentTheme.primaryColor : '#6b7280', 
                color: currentTheme.backgroundColor,
                opacity: validateForm() ? 1 : 0.5
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2"></div>
                  {isLogin ? 'Connexion...' : 'Inscription...'}
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {isLogin ? 'Se connecter' : 'S\'inscrire'}
                </>
              )}
            </Button>
          </form>

          {/* Basculer entre connexion/inscription */}
          <div className="text-center">
            <p className="text-sm" style={{ color: currentTheme.textColor + 'aa' }}>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={switchMode}
              className="mt-1"
              style={{ color: currentTheme.primaryColor }}
            >
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </Button>
          </div>

          {/* Informations sur Le Lapin Blanc */}
          <div 
            className="text-center p-4 rounded-lg border"
            style={{
              backgroundColor: currentTheme.backgroundColor + '40',
              borderColor: currentTheme.primaryColor + '20'
            }}
          >
            <p className="text-xs mb-2" style={{ color: currentTheme.primaryColor }}>
              🐰 Bienvenue dans Le Lapin Blanc
            </p>
            <p className="text-xs" style={{ color: currentTheme.textColor + 'aa' }}>
              Système RPG de gamification personnelle avec attaques, titres et progression infinie
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
