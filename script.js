
fetch('./hondaecucomponents.json')
    .then(data => data.json())
    .then(json => {
        const tbody = document.getElementsByTagName('tbody')[0];

        if (!json.components) return;

        json.components.forEach(componentsNode => {
            const tr = document.createElement('tr');

            Object.values(componentsNode).forEach((property, propertyIndex) => {
                if (propertyIndex > 3) return;
                
                let html = property;
                const td = document.createElement('td');

                if (propertyIndex === 0) {
                    html = property.join(', ');

                    if (componentsNode.boards) {
                        const sup = document.createElement('sup');
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
                        html = html.replace(match[0], `<span class="eletrical-spec">${content}</span>`);
                        td.dataset.original = (td.dataset.original || '') + ` ${content}`;
                    }
                } else {
                    if (property !== '') td.dataset.original = property;
                }

                td.innerHTML = html;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
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
                    a.innerHTML = node.group ? `${node.name} (<i>${node.group}</i>)` : node.name;

                    li.appendChild(a);
                } else
                    li.innerHTML = node.name;
                
                credits.appendChild(li);
            });
        }
    }).catch(() => {});