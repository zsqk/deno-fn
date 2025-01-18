type Condition = 'AND' | 'OR';

/**
 * 逻辑运算符
 */
export enum LogicOperator {
  /**
   * `>`
   */
  'greaterThan',
  /**
   * `<`
   */
  'lessThan',
  /**
   * `===`
   */
  'equals',
  /**
   * `!==`
   */
  'notEqual',
  /**
   * `>=`
   */
  'greaterThanOrEqual',
  /**
   * `<=`
   */
  'lessThanOrEqual',
  /**
   * `!== null && !== undefined && !== ''`
   */
  'isValid',
  /**
   * `=== null || === undefined || === ''`
   */
  'isInvalid',
  /**
   * `.startsWith()`
   */
  'startsWith',
  /**
   * `.endsWith()`
   */
  'endsWith',
  /**
   * `aString.includes(bString)`
   */
  'includes',
  /**
   * `bString.includes(aString)`
   */
  'beIncludes',
  /**
   * 转为数组有相交
   * `arrA.some(item => arrB.includes(item))`
   */
  'arrIntersecting',
  /**
   * 转为数组不相交
   * `arrA.every(item => !arrB.includes(item))`
   */
  'arrDisjoint',
  /**
   * 数组包含
   * `arrA.every(item => arrB.includes(item))`
   */
  'arrContains',
}

type FieldItem<K> = {
  field: K;
  operator: LogicOperator.isValid | LogicOperator.isInvalid;
} | {
  field: K;
  operator: LogicOperator;
  value: string | number;
};

/**
 * 逻辑关系
 */
export type LogicRelationship<K> = {
  condition: Condition;
  rules: Array<FieldItem<K> | LogicRelationship<K>>;
};

function fieldItemCalculate<K extends string>(
  data: Record<K, string | number>,
  item: FieldItem<K>,
): boolean {
  const v = data[item.field];
  if (v === undefined) {
    throw new Error(`Field "${item.field}" not found`);
  }

  /**
   * 将 item.value 进行类型转换为和 v 一致
   */
  function getContrast(ruleValue: string | number) {
    switch (typeof v) {
      case typeof ruleValue:
        return ruleValue;
      case 'string':
        return `${ruleValue}`;
      case 'number':
        return Number(ruleValue);
      default:
        // 变量 v 为不被支持的类型
        throw new Error(
          `Field "${item.field}" type "${typeof v}" is not supported`,
        );
    }
  }

  // 执行逻辑运算
  switch (item.operator) {
    case LogicOperator.greaterThan:
      return v > getContrast(item.value);
    case LogicOperator.lessThan:
      return v < getContrast(item.value);
    case LogicOperator.equals:
      return v === getContrast(item.value);
    case LogicOperator.notEqual:
      return v !== getContrast(item.value);
    case LogicOperator.greaterThanOrEqual:
      return v >= getContrast(item.value);
    case LogicOperator.lessThanOrEqual:
      return v <= getContrast(item.value);
    case LogicOperator.isValid:
      return v !== '' && v !== null && v !== undefined;
    case LogicOperator.isInvalid:
      return v === '' || v === null || v === undefined;
    case LogicOperator.startsWith:
      return `${v}`.startsWith(`${item.value}`);
    case LogicOperator.endsWith:
      return `${v}`.endsWith(`${item.value}`);
    case LogicOperator.includes:
      return `${v}`.includes(`${item.value}`);
    case LogicOperator.beIncludes:
      return `${item.value}`.includes(`${v}`);
    case LogicOperator.arrIntersecting: {
      const a = `${v}`.split(',');
      const b = `${item.value}`.split(',');
      return a.some((aItem) => b.includes(aItem));
    }
    case LogicOperator.arrDisjoint: {
      const a = `${v}`.split(',');
      const b = `${item.value}`.split(',');
      return a.every((aItem) => !b.includes(aItem));
    }
    case LogicOperator.arrContains: {
      const a = `${v}`.split(',');
      const b = `${item.value}`.split(',');
      return a.every((aItem) => b.includes(aItem));
    }
    default:
      throw new Error(`Unknown operator "${toStringForPrint(item)}"`);
  }
}

function toStringForPrint(v: unknown) {
  if (typeof v === 'bigint') {
    return `${v}n`;
  }
  if (typeof v === 'object') {
    return JSON.stringify(v);
  }
  return `${v}`;
}

/**
 * 逻辑计算
 * ----------
 *
 * 在做字符串包含匹配时, 建议:
 * 1. 定长, 比如 `022,122,032` 不包含 `012`.
 * 2. 额外处理字符串, 比如 `',22,122,32,'` 不包含 `',12,'`.
 * @param data
 * @param logicRelationship
 * @returns
 */
export function logicCalculate<K extends string>(
  data: Record<K, string | number>,
  logicRelationship: LogicRelationship<K>,
): boolean {
  const { condition, rules } = logicRelationship;
  if (rules.length === 0) {
    return true;
  }
  if (condition === 'AND') {
    return rules.every((rule) => {
      if ('condition' in rule) {
        return logicCalculate(data, rule);
      }
      return fieldItemCalculate(data, rule);
    });
  }
  if (condition === 'OR') {
    return rules.some((rule) => {
      if ('condition' in rule) {
        return logicCalculate(data, rule);
      }
      return fieldItemCalculate(data, rule);
    });
  }
  return false;
}
