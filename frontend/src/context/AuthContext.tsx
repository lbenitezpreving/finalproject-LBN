import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Aquí implementaremos la verificación del token al cargar
    const checkAuth = async () => {
      try {
        // Por ahora solo simularemos un usuario autenticado
        // En una implementación real, verificaríamos el token y obtendríamos los datos del usuario
        setIsLoading(false);
      } catch (error) {
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      // Aquí implementaremos la lógica de inicio de sesión con el backend
      // Por ahora simulamos un usuario autenticado
      const mockUser: User = {
        id: 1,
        username,
        name: 'Usuario Ejemplo',
        email: `${username}@example.com`,
        role: UserRole.TECNOLOGIA,
      };
      
      setUser(mockUser);
      // Guardaríamos el token en localStorage
    } catch (error) {
      throw new Error('Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Eliminar token de localStorage
    setUser(null);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}; 