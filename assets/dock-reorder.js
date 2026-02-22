(function(){
  function init(){
    const dock = document.getElementById('dock');
    if(!dock) return;
    const container = dock.querySelector('div._dockEl_1f0zn_14');
    if(!container) return;

    // Restore saved order (by data-appid when available)
    try{
      const saved = localStorage.getItem('dockOrder');
      if(saved){
        const order = JSON.parse(saved);
        order.forEach(id=>{
          const el = container.querySelector(`div[data-appid="${id}"]`);
          if(el) container.appendChild(el);
        });
      }
    }catch(e){}

    // Ensure Finder appears first (find via icon path if data-appid absent)
    const findByIcon = id => container.querySelector(`img[src$="/assets/app-icons/${id}/256.webp"]`)?.closest('div');
    const finder = container.querySelector('div[data-appid="finder"]') || findByIcon('finder');
    if(finder) container.insertBefore(finder, container.firstChild);

    // Make items draggable and set data-appid when possible
    Array.from(container.children).forEach(child=>{
      try{ child.setAttribute('draggable','true'); }catch(e){}
      if(!child.dataset.appid){
        const img = child.querySelector('img');
        if(img){
          const m = String(img.getAttribute('src')||'').match(/app-icons\/([^\/]+)\//);
          if(m) child.dataset.appid = m[1];
        }
      }
    });

    let dragEl = null;

    function getDragAfterElement(container, x){
      const draggableElements = [...container.querySelectorAll('div[draggable="true"]:not(.dragging)')];
      let closest = {offset: Number.NEGATIVE_INFINITY, element: null};
      draggableElements.forEach(child=>{
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width/2;
        if(offset < 0 && offset > closest.offset){
          closest = {offset, element: child};
        }
      });
      return closest.element;
    }

    container.addEventListener('dragstart', e=>{
      const target = e.target.closest('div[draggable="true"]');
      if(!target) return;
      dragEl = target;
      try{ e.dataTransfer.setData('text/plain', target.dataset.appid || ''); e.dataTransfer.effectAllowed = 'move'; }catch(err){}
      target.classList.add('dragging');
    });

    container.addEventListener('dragend', ()=>{
      if(dragEl) dragEl.classList.remove('dragging');
      dragEl = null;
      updateOrder();
    });

    container.addEventListener('dragover', e=>{
      e.preventDefault();
      if(!dragEl) return;
      const afterElement = getDragAfterElement(container, e.clientX);
      if(afterElement == null) container.appendChild(dragEl);
      else container.insertBefore(dragEl, afterElement);
    });

    container.addEventListener('drop', e=>{ e.preventDefault(); updateOrder(); });

    function updateOrder(){
      const order = Array.from(container.querySelectorAll('div[draggable="true"]')).map(el=>el.dataset.appid||'');
      try{ localStorage.setItem('dockOrder', JSON.stringify(order)); }catch(e){}
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
