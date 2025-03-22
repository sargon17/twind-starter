import tailwind from './tailwind.json'

export default function (): void {
  // Function to delete all collections named "Tailwind"
  function deleteTailwindCollections() {
    const collections = figma.variables.getLocalVariableCollections();
    for (const collection of collections) {
      if (collection.name === "Tailwind") {
        collection.remove();
        console.log(`Deleted collection: ${collection.name}`);
      }
    }
  }

  // Call the delete function (for debugging/cleanup)
  deleteTailwindCollections();





  const collection = figma.variables.createVariableCollection('Tailwind');
  const mode = collection.modes[0]

  const colors = tailwind.colors

  Object.entries(colors).forEach(([name, value]) => {
    if(typeof value === 'string') {
      const variable = figma.variables.createVariable(
        `color/${name}`,
        collection,
        'COLOR'
      );

      variable.setValueForMode(mode.modeId, figma.util.rgb(value))
    } else {
      Object.entries(value).forEach(([key, value]) => {
        const variable = figma.variables.createVariable(
          `color/${name}/${key}`,
        collection,
          'COLOR'
        );

        variable.setValueForMode(mode.modeId, figma.util.rgb(value))
      })
    }
  })
  
  
  figma.closePlugin('Collection created')
}
