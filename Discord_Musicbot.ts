import { default as Alloybot, Type, Util } from '../../Alloybot';
import { EventEmitter } from 'events';

export class Discord_Musicbot extends EventEmitter implements Type.IPlugin {
  public readonly name: string = 'Discord-Musicbot';
  public readonly dependencies: string[] = ['Commander', 'Discord', 'MongoDB'];
  public readonly dependants: Type.IPlugin[] = Alloybot.getDependants(this.name);

  constructor() {
    super();
  }
}

Alloybot.registerPlugin(new Discord_Musicbot());