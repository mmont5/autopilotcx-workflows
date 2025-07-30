import { MaestroAgent } from './nodes/MaestroAgent.node';
import { ComposerAgent } from './nodes/ComposerAgent.node';
import { AppointmentScheduler } from './nodes/AppointmentScheduler.node';
import { AgentTrainer } from './nodes/AgentTrainer.node';

export const nodes = [
  {
    className: 'MaestroAgent',
    sourcePath: './nodes/MaestroAgent.node.ts',
  },
  {
    className: 'ComposerAgent',
    sourcePath: './nodes/ComposerAgent.node.ts',
  },
  {
    className: 'AppointmentScheduler',
    sourcePath: './nodes/AppointmentScheduler.node.ts',
  },
  {
    className: 'AgentTrainer',
    sourcePath: './nodes/AgentTrainer.node.ts',
  },
]; 