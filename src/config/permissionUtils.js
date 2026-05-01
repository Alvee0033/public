export function filterSidebarItems(items, permissions) {
  return items
    .map((item) => {
      // Filter sub-items based on permissions
      const filteredSubItems = item.items?.filter((subItem) => {
        if (!subItem.permissionKey) return true; // Include if no permissionKey is specified

        const [category, action] = subItem.permissionKey.split(":");
        return permissions[category]?.includes(action); // Check if user has permission
      });

      // Include the parent item only if it has visible sub-items OR if parent has no permissionKey
      if (item.items && filteredSubItems.length > 0) {
        return { ...item, items: filteredSubItems }; // Include with filtered sub-items
      }

      if (!item.permissionKey) {
        return { ...item, items: filteredSubItems }; // Include parent with no permissionKey, along with filtered subitems
      }

      // If no sub-items but the parent itself has a permissionKey, check its permission
      if (item.permissionKey) {
        const [category, action] = item.permissionKey.split(":");
        if (permissions[category]?.includes(action)) {
          return { ...item, items: [] }; // Include parent with no sub-items
        }
      }

      return null; // Exclude the item if no permissions match
    })
    .filter(Boolean); // Remove null values
}

export function transformPermissions(permissionsArray) {
  const transformedPermissions = {};

  permissionsArray.forEach((permission) => {
    const [category, action] = permission.split(":");

    if (!transformedPermissions[category]) {
      transformedPermissions[category] = [];
    }

    transformedPermissions[category].push(action);
  });

  return transformedPermissions;
}
