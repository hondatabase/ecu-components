fetch('./hondaecucomponents.json')
    .then(data => data.json())
    .then(json => {
        const table = document.getElementsByTagName('table')[0];
        if (!json.components) return;

        json.components.forEach(componentsNode => {
            const componentTbody = document.createElement('tbody');
            componentTbody.className = 'print:break-inside-avoid';
            
            const tr = document.createElement('tr');
            tr.className = 'transition-colors duration-200 hover:text-white hover:bg-honda even:bg-gray-200';

            Object.values(componentsNode).forEach((property, propertyIndex) => {
                if (propertyIndex > 2) return;  // Only process first 3 columns
                let html = property;
                const td = document.createElement('td');
                td.className = 'border border-black p-2 text-left whitespace-nowrap';
                if (propertyIndex === 0) td.classList.add('font-medium');

                if (propertyIndex === 0) {
                    html = property.join(', ');
                    if (componentsNode.boards) {
                        const sup = document.createElement('sup');
                        sup.className = 'ml-1 text-xxs';
                        sup.title = 'ECU Board(s)';
                        sup.innerHTML = componentsNode.boards.join(', ');
                        html += sup.outerHTML;
                    }
                    td.dataset.original = html;
                } else if (propertyIndex === 2) {
                    const regex = /\(([^)]*(OHM|A|V|W|uF|pF|MHz)[^)]*)\)/g;
                    let match;
                    while (match = regex.exec(property)) {
                        let content = match[1];
                        let unit = content.split(' ').pop();
                        let symbol = unit === 'OHM' ? 'Ω' :
                            unit === 'A' ? 'Amps' :
                            unit === 'V' ? 'Volts' :
                            unit === 'W' ? 'Watts' :
                            unit === 'uF' ? 'µF' : unit;
                        content = content.replace(unit, symbol);
                        html = html.replace(match[0], `<span class="mr-1 rounded-full border border-black italic text-xs font-medium px-1.5 whitespace-nowrap">${content}</span>`);
                        td.dataset.original = (td.dataset.original || '') + ` ${content}`;
                    }
                } else {
                    if (property !== '') td.dataset.original = property;
                }

                td.innerHTML = html;
                tr.appendChild(td);
            });

            componentTbody.appendChild(tr);

            // Add notes row if it exists
            if (componentsNode.notes && componentsNode.notes !== '') {
                const notesRow = document.createElement('tr');
                notesCell.colSpan = 3;
                notesCell.className = 'border border-black p-2 pl-8 text-left bg-gray-50 italic text-gray-600';
                notesCell.innerHTML = componentsNode.notes;
                notesRow.appendChild(notesCell);
                componentTbody.appendChild(notesRow);
            }

            table.appendChild(componentTbody);
        });

        const credits = document.querySelector('#credits > ul');
        if (json.credits) {
            json.credits.forEach(node => {
                const li = document.createElement('li');
                if (node.link) {
                    const a = document.createElement('a');
                    a.href = node.link;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = 'text-honda';
                    a.innerHTML = node.group ? `${node.name} (<i>${node.group}</i>)` : node.name;
                    li.appendChild(a);
                } else
                    li.innerHTML = node.name;
                credits.appendChild(li);
            });
        }
    }).catch(() => {});