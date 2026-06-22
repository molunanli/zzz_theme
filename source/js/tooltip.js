(function() {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip-custom';
  document.body.appendChild(tooltip);

  let currentTarget = null; // 记录当前悬停的元素，避免闪烁

  // 用 mouseover 委托（冒泡）
  document.addEventListener('mouseover', function(e) {
    // 确保 e.target 是元素节点
    const el = e.target instanceof Element ? e.target : e.target.parentElement;
    const target = el?.closest('[data-tooltip]');
    if (!target || target === currentTarget) return;

    const text = target.getAttribute('data-tooltip');
    if (!text) return;

    currentTarget = target;
    tooltip.textContent = text;
    tooltip.classList.add('active');
    updatePosition(target);
  });

  // 用 mouseout 委托
  document.addEventListener('mouseout', function(e) {
    // 同样处理
    const el = e.target instanceof Element ? e.target : e.target.parentElement;
    const target = el?.closest('[data-tooltip]');
    if (!target || target !== currentTarget) return;

    // 检查鼠标是否真的离开了目标（避免冒泡误判）
    if (target.contains(e.relatedTarget)) return;

    currentTarget = null;
    tooltip.classList.remove('active');
  });

  function updatePosition(target) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 8;

    // 边缘检测
    if (left < 5) left = 5;
    if (left + tooltipRect.width > window.innerWidth - 5) {
      left = window.innerWidth - tooltipRect.width - 5;
    }
    if (top < 5) {
      top = rect.bottom + 4;
      tooltip.style.transform = 'translateY(-4px)';
    } else {
      tooltip.style.transform = 'translateY(4px)';
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  // 滚动或缩放时隐藏
  window.addEventListener('scroll', () => {
    tooltip.classList.remove('active');
    currentTarget = null;
  }, { passive: true });
  window.addEventListener('resize', () => {
    tooltip.classList.remove('active');
    currentTarget = null;
  });
})();