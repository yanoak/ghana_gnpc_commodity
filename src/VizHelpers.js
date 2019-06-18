export const makeTooltip = (title,items) => {
  let htmlBlock = "<div class='tootltip' style='font-size:12px; border: 1px solid #ccc; background-color: rgba(255,255,255,0.9); padding:5px; max-width:350px; z-index:2000'>"
  htmlBlock += title ? "<div style='font-size:20px'>" + title + "</div>" : '';
  if (items)
    items.forEach(i => {
      htmlBlock += ("<br/><strong>"+i.label+":</strong> ")
      htmlBlock += ("<div class='tootltip-value' style='font-size:18px;'>"+i.value+"</div>")
    })
  htmlBlock += '</div>';
  return htmlBlock;
}

