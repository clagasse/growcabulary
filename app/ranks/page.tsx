import type { Metadata } from 'next';
import { BotanicalRanksClient } from '../../components/BotanicalRanksClient';

export const metadata: Metadata = {
  title: 'Botanical Ranks & Progression',
  description:
    'View your current Botanical Rank, Mastery Points, difficulty and topic progression, and all 13 Growcabulary ranks.',
};

export default function RanksPage() {
  return <BotanicalRanksClient />;
}
