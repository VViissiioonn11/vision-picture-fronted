// 审核状态枚举（数字值作为唯一标识）
export const PIC_REVIEW_STATUS_ENUM = Object.freeze({
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2
});

// 状态显示文本映射（通过枚举值访问）
export const PIC_REVIEW_STATUS_MAP = Object.freeze({
  [PIC_REVIEW_STATUS_ENUM.REVIEWING]: '待审核',
  [PIC_REVIEW_STATUS_ENUM.PASS]: '通过',
  [PIC_REVIEW_STATUS_ENUM.REJECT]: '拒绝'
});

// 生成Select组件所需的选项格式（value为Number类型）
export const PIC_REVIEW_STATUS_OPTIONS = Object.entries(PIC_REVIEW_STATUS_MAP).map(
  ([value, label]) => ({
    label,
    value: Number(value) // 显式转换为数字类型
  })
);
