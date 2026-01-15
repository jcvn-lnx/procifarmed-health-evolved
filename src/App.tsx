import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CartProvider } from "@/context/CartContext";
import { ShopPage } from "@/pages/Shop";
import { ProductPage } from "@/pages/Product";
import { AboutPage } from "@/pages/About";
import { ContactPage } from "@/pages/Contact";
import { AuthProvider } from "@/context/AuthContext";
import { LoginPage } from "@/pages/Login";
import { SignupPage } from "@/pages/Signup";
import { CheckoutPage } from "@/pages/Checkout";
import { OrderPage } from "@/pages/Order";
import { AccountPage } from "@/pages/Account";
import { AdminPage } from "@/pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/loja" element={<ShopPage />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/institucional" element={<AboutPage />} />
              <Route path="/contato" element={<ContactPage />} />

              <Route path="/entrar" element={<LoginPage />} />
              <Route path="/cadastrar" element={<SignupPage />} />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedido/:id" element={<OrderPage />} />
              <Route path="/conta" element={<AccountPage />} />

              <Route path="/admin" element={<AdminPage />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

