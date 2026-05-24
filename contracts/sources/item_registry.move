module gear_vault::item_registry {
    use std::string::String;
    use std::vector;
    use sui::object::{UID, ID};
    use sui::tx_context::TxContext;
    use sui::table::{Table, new};
    use sui::table_vec::{TableVec, new, push_back, borrow, length};

    /// Item statistics structure
    struct ItemStats has store, drop {
        attack: u32,
        defense: u32,
        speed: u32,
        luck: u32,
    }

    /// Core item structure stored on-chain
    struct Item has key, store {
        id: UID,
        name: String,
        rarity: u8,           // 1=Common, 2=Rare, 3=Epic, 4=Legendary
        stats: ItemStats,
        metadata_uri: String, // Walrus blob ID reference
        studio_id: ID,
        created_at: u64,
    }

    /// Global item registry
    struct ItemRegistry has key, store {
        id: UID,
        items: Table<ID, Item>,
        item_counter: u64,
    }

    /// Initialize the item registry
    fun init(ctx: &mut TxContext) {
        transfer::share_object(ItemRegistry {
            id: object::new(ctx),
            items: new(ctx),
            item_counter: 0,
        });
    }

    /// Create a new item
    public fun create_item(
        name: String,
        rarity: u8,
        attack: u32,
        defense: u32,
        speed: u32,
        luck: u32,
        metadata_uri: String,
        studio_id: ID,
        ctx: &mut TxContext
    ): Item {
        let stats = ItemStats {
            attack,
            defense,
            speed,
            luck,
        };
        
        Item {
            id: object::new(ctx),
            name,
            rarity,
            stats,
            metadata_uri,
            studio_id,
            created_at: tx_context::epoch(ctx),
        }
    }

    /// Add item to registry
    public fun register_item(registry: &mut ItemRegistry, item: Item) {
        let item_id = object::id(&item);
        registry.items.add(item_id, item);
        registry.item_counter = registry.item_counter + 1;
    }

    /// Get item by ID
    public fun get_item(registry: &ItemRegistry, item_id: ID): &Item {
        registry.items.borrow(item_id)
    }

    /// Get item rarity name
    public fun get_rarity_name(rarity: u8): String {
        if (rarity == 1) { b"Common".to_string() }
        else if (rarity == 2) { b"Rare".to_string() }
        else if (rarity == 3) { b"Epic".to_string() }
        else if (rarity == 4) { b"Legendary".to_string() }
        else { b"Unknown".to_string() }
    }

    /// Calculate item power score
    public fun calculate_power(item: &Item): u64 {
        let stats = &item.stats;
        (stats.attack as u64) + (stats.defense as u64) + (stats.speed as u64) + (stats.luck as u64)
    }

    /// Get total items count
    public fun get_item_count(registry: &ItemRegistry): u64 {
        registry.item_counter
    }
}