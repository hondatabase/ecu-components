const fs = require('fs');

const data = JSON.parse(fs.readFileSync('hondaecucomponents.json', 'utf8'));

let failures = [];

data.components.forEach((component, index) => {
	try {
		if (!component.ids) throw new Error('Missing required property: ids');
		if (!Array.isArray(component.ids)) throw new Error('ids must be an array');
		if (component.ids.length === 0) throw new Error('ids array is empty');

		if (component.boards && !Array.isArray(component.boards)) throw new Error('boards must be an array');
		if (component.boards && component.boards.length === 0) throw new Error('boards array is empty');

		const componentDuplicates = component.ids.filter((id, index, self) => self.indexOf(id) !== index);
		if (componentDuplicates.length > 0) throw new Error(`Duplicate IDs found in component: ${componentDuplicates}`);

		for (const key in component) {
			if (typeof component[key] !== 'string' && !Array.isArray(component[key])) throw new Error(`Value for ${key} in component must be a string or an array of strings`);

			if (Array.isArray(component[key])) {
				for (const item of component[key]) {
					if (typeof item !== 'string')
						throw new Error(`Items in ${key} array in component must be strings`);
				}
			}
		}
	} catch (error) {
		failures.push({
			index: index + 1,
			error: error.message,
		});
	}
});

if (failures.length > 0) {
	console.error('Validation Failed: The following components have errors:');
	failures.forEach(component => console.error(`Component ${component.index}: ${component.error}`));
	process.exit(1);
} else {
	console.log('Validation Passed: All components are valid.');
}
