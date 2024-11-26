fetch('./hondaecucomponents.json')
    .then(data => data.json())
    .then(json => {
        if (!json.components) return;

        const table = document.getElementsByTagName('table')[0];

        json.components.forEach(componentsNode => {
            const componentTbody = document.createElement('tbody');
            componentTbody.className = 'component-group';
            
            const tr = document.createElement('tr');
            tr.className = 'component-row';

            Object.values(componentsNode).forEach((property, propertyIndex) => {
                if (propertyIndex > 2) return;
                let html = property;
                const td = document.createElement('td');
                td.className = 'component-cell';
                if (propertyIndex === 0) td.classList.add('component-name');

                if (propertyIndex === 0) {
                    html = property.join(', ');
                    if (componentsNode.boards) {
                        const sup = document.createElement('sup');
                        sup.className = 'board-info';
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
                        html = html.replace(match[0], `<span class="spec-unit">${content}</span>`);
                        td.dataset.original = (td.dataset.original || '') + ` ${content}`;
                    }
                } else {
                    if (property !== '') td.dataset.original = property;
                }

                td.innerHTML = html;
                tr.appendChild(td);
            });

            componentTbody.appendChild(tr);

            if (componentsNode.notes && componentsNode.notes !== '') {
                const notesRow = document.createElement('tr');
                const notesCell = document.createElement('td');
                notesCell.colSpan = 3;
                notesCell.className = 'notes-cell';
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
                    a.className = 'honda-link';
                    a.innerHTML = node.group ? `${node.name} (<i>${node.group}</i>)` : node.name;
                    li.appendChild(a);
                } else
                    li.innerHTML = node.name;
                credits.appendChild(li);
            });
        }
    }).catch(err => console.error('Failed to load components:', err));