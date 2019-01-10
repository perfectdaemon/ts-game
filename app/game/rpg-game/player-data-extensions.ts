import { InventoryItemData, ItemType, PlayerData } from './player-data';

export class PlayerDataExtensions {
  static attackDamageMinMaxSummary(data: PlayerData): [number, number] {
    const weapons = this.get(data, ItemType.Weapon);

    let sumMin = 0;
    let sumMax = 0;

    for (const weapon of weapons) {
      if (!weapon.weapon) {
        throw new Error(`Type is weapon, but no weapon data provided`);
      }
      sumMin += weapon.weapon.damageMin;
      sumMax += weapon.weapon.damageMax;
    }

    return [sumMin, sumMax];
  }

  static attackCount(data: PlayerData): number {
    const weapons = this.get(data, ItemType.Weapon);

    let attackCount = 0;

    for (const weapon of weapons) {
      if (!weapon.weapon) {
        throw new Error(`Type is weapon, but no weapon data provided`);
      }
      ++attackCount;
      if (weapon.weapon.addAttack) {
        attackCount += weapon.weapon.addAttack;
      }
    }

    return attackCount;
  }

  static protectCount(data: PlayerData): number {
    const shields = this.get(data, ItemType.Shield);

    let protectCount = 0;

    for (const shield of shields) {
      if (!shield.shield) {
        throw new Error(`Type is shield, but no shield data provided`);
      }
      ++protectCount;
      if (shield.shield.addProtect) {
        protectCount += shield.shield.addProtect;
      }
    }

    return protectCount;
  }

  static calculateDamages(data: PlayerData): DamageInfo[] {
    const weapons = this.get(data, ItemType.Weapon);

    const result: DamageInfo[] = [];

    for (const weapon of weapons) {
      if (!weapon.weapon) {
        throw new Error(`Type is weapon, but no weapon data provided`);
      }
      // Base
      let damage = weapon.weapon.damageMin + Math.random() * (weapon.weapon.damageMax - weapon.weapon.damageMin);

      // Critical
      let isCritical: boolean = false;
      if (Math.random() <= data.criticalChance) {
        damage *= data.criticalMultiplier;
        isCritical = true;
      }

      result.push({ damage, isCritical, shieldPiercing: weapon.weapon.shieldPiercing || 0 });
    }

    return result;
  }

  static calculateProtections(data: PlayerData): ProtectionInfo[] {
    const shields = this.get(data, ItemType.Shield);

    const result: ProtectionInfo[] = [];

    for (const shield of shields) {
      if (!shield.shield) {
        throw new Error(`Type is shield, but no shield data provided`);
      }
      // Base
      const protectionMultiplier = shield.shield.shieldMultiplier;

      result.push({ protectionMultiplier });
    }

    return result;
  }

  private static get(data: PlayerData, type: ItemType): InventoryItemData[] {
    return data.cells
      .filter(it => !!it.item && it.item.type === type)
      .map(it => it.item as InventoryItemData);
  }
}

export class DamageInfo {
  damage: number;
  isCritical: boolean;
  shieldPiercing: number;
}

export class ProtectionInfo {
  protectionMultiplier: number;
}
