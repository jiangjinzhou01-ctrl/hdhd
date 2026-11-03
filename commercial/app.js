// The full page, navigation and native FAQs work without JavaScript.
const copy = document.querySelector('#copy-keyword');
const keyword = document.querySelector('#consult-keyword');
const status = document.querySelector('#copy-status');
if (copy && keyword && status) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(keyword.textContent.trim());
      status.textContent = '已复制「回忆定制」。回到抖音，发给分享这份作品的作者。';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(keyword);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      status.textContent = '自动复制不可用，关键词已选中。请长按或按 Ctrl/Cmd+C 复制，再到抖音私信。';
    }
  });
}
