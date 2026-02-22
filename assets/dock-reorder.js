(function(){
  function init(){
    const dock = document.getElementById('dock');
    if(!dock) return;
    const container = dock.querySelector('div._dockEl_1f0zn_14');
    if(!container) return;

    // Ensure each child has a data-appid (derive from icon path) and set draggable state.
    Array.from(container.children).forEach(child=>{
      // derive appid from child img if missing
      if(!child.dataset.appid){
        const img = child.querySelector('img');
        if(img){
          const m = String(img.getAttribute('src')||'').match(/app-icons\/([^\/]+)\//);
          if(m) child.dataset.appid = m[1];
        }
      }
      // make everything draggable by default; Finder will be fixed below
      try{ child.setAttribute('draggable','true'); }catch(e){}
    });

    // Make Finder fixed: non-draggable and always placed first.
    const findByIcon = id => container.querySelector(`img[src$="/assets/app-icons/${id}/256.webp"]`)?.closest('div');
    const finder = container.querySelector('div[data-appid="finder"]') || findByIcon('finder');
    if(finder){
      try{ finder.setAttribute('draggable','false'); }catch(e){}
      finder.dataset.appid = 'finder';
      // ensure others remain draggable
      Array.from(container.children).forEach(child=>{
        if(child !== finder){ try{ child.setAttribute('draggable','true'); }catch(e){} }
      });
    }

    // Restore saved order (by data-appid) but skip finder so it stays fixed at start
    try{
      const saved = localStorage.getItem('dockOrder');
      if(saved){
        const order = JSON.parse(saved);
        order.forEach(id=>{
          if(id === 'finder') return; // skip Finder to keep it at the left
          const el = container.querySelector(`div[data-appid="${id}"]`);
          if(el) container.appendChild(el);
        });
      }
    }catch(e){}

    // Finally ensure Finder is the very first item
    if(finder) container.insertBefore(finder, container.firstElementChild);

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
      // prevent dragging finder if it somehow remained draggable
      if(target.dataset.appid === 'finder') return;
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
      // Save order excluding Finder (always first)
      const order = Array.from(container.querySelectorAll('div')).map(el=>el.dataset.appid||'').filter(id=>id && id !== 'finder');
      try{ localStorage.setItem('dockOrder', JSON.stringify(order)); }catch(e){}
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
