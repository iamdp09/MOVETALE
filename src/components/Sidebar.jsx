import { motion } from 'framer-motion';

const Sidebar = ({ items, activeItem, onItemClick, title, className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            {title && (
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 px-3">
                    {title}
                </h3>
            )}
            <div className="space-y-1">
                {items.map((item) => {
                    const isActive = activeItem === item.id;
                    const Icon = item.icon;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => onItemClick?.(item.id)}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive
                                    ? 'bg-accent/15 text-accent border border-accent/20'
                                    : 'text-muted hover:text-white hover:bg-white/5'
                                }
              `}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {Icon && <Icon size={18} />}
                            <span>{item.label}</span>
                            {item.count !== undefined && (
                                <span className={`ml-auto text-xs ${isActive ? 'text-accent' : 'text-muted'}`}>
                                    {item.count}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
