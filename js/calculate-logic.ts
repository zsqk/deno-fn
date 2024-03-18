type Condition = 'AND' | 'OR';

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
   * `.startsWith()`
   */
  'startsWith',
  /**
   * `.endsWith()`
   */
  'endsWith',
  /**
   * `a.includes(b)`
   */
  'includes',
  /**
   * `b.includes(a)`
   */
  'beIncludes',
}

type FieldItem<K> = {
  field: K;
  operator: LogicOperator;
  value: string | number;
};

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
  let contrast: typeof v;
  if (typeof v !== typeof item.value) {
    switch (typeof v) {
      case 'string':
        contrast = `${item.value}`;
        break;
      case 'number':
        contrast = Number(item.value);
        break;
      default:
        // 变量 v 为不被支持的类型
        throw new Error(
          `Field "${item.field}" type "${typeof v}" is not supported`,
        );
    }
  } else {
    contrast = item.value;
  }

  // 执行逻辑运算
  switch (item.operator) {
    case LogicOperator.greaterThan:
      return v > contrast;
    case LogicOperator.lessThan:
      return v < contrast;
    case LogicOperator.equals:
      return v === contrast;
    case LogicOperator.notEqual:
      return v !== contrast;
    case LogicOperator.greaterThanOrEqual:
      return v >= contrast;
    case LogicOperator.lessThanOrEqual:
      return v <= contrast;
    case LogicOperator.isValid:
      return v !== '' && v !== null && v !== undefined;
    case LogicOperator.startsWith:
      return `${v}`.startsWith(`${contrast}`);
    case LogicOperator.endsWith:
      return `${v}`.endsWith(`${contrast}`);
    case LogicOperator.includes:
      return `${v}`.includes(`${contrast}`);
    case LogicOperator.beIncludes:
      return `${contrast}`.includes(`${v}`);
    default:
      throw new Error(`Unknown operator "${item.operator}"`);
  }
}

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
