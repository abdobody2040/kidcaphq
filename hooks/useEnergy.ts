
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { User } from '../types';

const MAX_ENERGY = 5;
const REFILL_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 Hours

export const useEnergy = () => {
  const { user, updateUser, hasUnlimitedEnergy } = useAppStore();
  const [timeToNextRefill, setTimeToNextRefill] = useState<string>('');

  const isUnlimited = hasUnlimitedEnergy();

  // Refill Logic
  useEffect(() => {
    if (!user || isUnlimited) return;

    // If full, just show Full and STOP. 
    // Do not update user here to avoid infinite render loops.
    if (user.energy >= MAX_ENERGY) {
        setTimeToNextRefill('Full');
        return;
    }

    const checkRefill = () => {
      const now = Date.now();
      // Safety check: if lastRefill is missing/invalid, treat as now
      let lastRefill = user.lastEnergyRefill && !isNaN(new Date(user.lastEnergyRefill).getTime())
        ? user.lastEnergyRefill 
        : now;

      // Time Travel Check
      if (now < lastRefill) {
          // Cheat detected (User moved clock back or system time invalid)
          // Fix: Reset to now to prevent exploiting infinite waits or loops
          lastRefill = now;
          updateUser(user.id, { lastEnergyRefill: now });
      }
        
      const timePassed = now - lastRefill;

      // Calculate how many chunks of 4 hours passed
      if (timePassed >= REFILL_INTERVAL_MS) {
        const energyGenerated = Math.floor(timePassed / REFILL_INTERVAL_MS);
        const newEnergy = Math.min(MAX_ENERGY, user.energy + energyGenerated);
        
        // Reset timestamp to the "most recent" refill point to keep the cycle consistent
        // (Don't just set to 'now', or you lose partial progress)
        const remainder = timePassed % REFILL_INTERVAL_MS;
        const newLastRefill = now - remainder;

        // Only update if we actually gained energy
        if (newEnergy > user.energy) {
            updateUser(user.id, { 
                energy: newEnergy,
                lastEnergyRefill: newLastRefill 
            });
        }
      } else {
        // Update countdown string
        const remaining = REFILL_INTERVAL_MS - timePassed;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeToNextRefill(`${hours}h ${minutes}m`);
      }
    };

    // Check immediately and then every minute
    checkRefill();
    const interval = setInterval(checkRefill, 60000); 

    return () => clearInterval(interval);
  }, [user?.energy, user?.lastEnergyRefill, isUnlimited, updateUser, user?.id]);

  const consumeEnergy = (): boolean => {
    if (!user) return false;
    
    if (isUnlimited) return true;

    if (user.energy > 0) {
      const updates: Partial<User> = { energy: user.energy - 1 };
      
      // FIX: Infinite Energy Exploit
      // If we are at MAX_ENERGY, the timer isn't running (or is stale).
      // We must set lastEnergyRefill to Date.now() immediately to start the fresh 4-hour countdown.
      if (user.energy === MAX_ENERGY) {
          updates.lastEnergyRefill = Date.now();
      }
      
      updateUser(user.id, updates);
      return true;
    }

    return false;
  };

  return {
    energy: user?.energy || 0,
    maxEnergy: MAX_ENERGY,
    isUnlimited,
    timeToNextRefill,
    consumeEnergy
  };
};
