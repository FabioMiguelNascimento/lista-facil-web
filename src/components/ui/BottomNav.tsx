"use client";
import { Home, Plus, User } from 'lucide-react';
import { Button } from './button';

interface Props {
    active?: 'home' | 'profile';
    onAdd?: () => void;
    onHome?: () => void;
    onProfile?: () => void;
}

export default function BottomNav({ active = 'home', onAdd, onHome, onProfile }: Props) {
    return (
        <nav className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
            <div className="mx-auto max-w-md bg-transparent backdrop-blur-sm border border-zinc-800 rounded-full px-3 py-2 flex items-center justify-between shadow-lg">
                <Button variant="ghost" onClick={onHome} aria-label="Home" className={`${active === 'home' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    <Home />
                </Button>

                <Button onClick={onAdd} className="h-16 w-16 p-0 bg-emerald-600 rounded-full text-white shadow-lg -mt-6 flex items-center justify-center" aria-label="Add">
                    <Plus className="h-6 w-6" />
                </Button>

                <Button variant="ghost" onClick={onProfile} aria-label="Perfil" className={`${active === 'profile' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    <User />
                </Button>
            </div>
        </nav>
    );
}
