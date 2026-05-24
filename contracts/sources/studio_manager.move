module gear_vault::studio_manager {
    use std::string::String;
    use std::vector;
    use sui::object::{UID, ID};
    use sui::tx_context::TxContext;
    use sui::table::{Table, new, add, borrow, contains};
    use sui::object;

    /// Studio structure - represents a game studio that can whitelist items
    struct Studio has key, store {
        id: UID,
        name: String,
        owner: address,
        whitelisted_items: vector<ID>,
        is_active: bool,
        created_at: u64,
    }

    /// Global studio registry
    struct StudioRegistry has key, store {
        id: UID,
        studios: Table<address, Studio>,
        studio_ids: vector<address>,
    }

    /// Initialize the studio registry
    fun init(ctx: &mut TxContext) {
        transfer::share_object(StudioRegistry {
            id: object::new(ctx),
            studios: new(ctx),
            studio_ids: vector::empty(),
        });
    }

    /// Create a new studio
    public fun create_studio(
        name: String,
        ctx: &mut TxContext
    ): Studio {
        let sender = tx_context::sender(ctx);
        Studio {
            id: object::new(ctx),
            name,
            owner: sender,
            whitelisted_items: vector::empty(),
            is_active: true,
            created_at: tx_context::epoch(ctx),
        }
    }

    /// Add studio to registry
    public fun register_studio(registry: &mut StudioRegistry, studio: Studio) {
        let studio_addr = object::id_to_address(&object::uid_to_id(&studio.id));
        registry.studios.add(studio_addr, studio);
        vector::push_back(&mut registry.studio_ids, studio_addr);
    }

    /// Whitelist an item for a studio
    public fun whitelist_item(studio: &mut Studio, item_id: ID) {
        // Check if item is already whitelisted
        let is_whitelisted = false;
        let i = 0;
        let len = vector::length(&studio.whitelisted_items);
        
        while (i < len) {
            if (*vector::borrow(&studio.whitelisted_items, i) == item_id) {
                is_whitelisted = true;
                break;
            };
            i = i + 1;
        };
        
        if (!is_whitelisted) {
            vector::push_back(&mut studio.whitelisted_items, item_id);
        }
    }

    /// Revoke whitelist from an item
    public fun revoke_whitelist(studio: &mut Studio, item_id: ID) {
        let i = 0;
        let len = vector::length(&studio.whitelisted_items);
        
        while (i < len) {
            if (*vector::borrow(&studio.whitelisted_items, i) == item_id) {
                vector::remove(&mut studio.whitelisted_items, i);
                break;
            };
            i = i + 1;
        };
    }

    /// Check if studio is active
    public fun is_studio_active(studio: &Studio): bool {
        studio.is_active
    }

    /// Get studio by address
    public fun get_studio(registry: &StudioRegistry, studio_addr: address): &Studio {
        registry.studios.borrow(studio_addr)
    }

    /// Check if item is whitelisted for studio
    public fun is_item_whitelisted(studio: &Studio, item_id: ID): bool {
        let i = 0;
        let len = vector::length(&studio.whitelisted_items);
        
        while (i < len) {
            if (*vector::borrow(&studio.whitelisted_items, i) == item_id) {
                return true;
            };
            i = i + 1;
        };
        
        false
    }

    /// Get total studios count
    public fun get_studio_count(registry: &StudioRegistry): u64 {
        vector::length(&registry.studio_ids)
    }

    /// Deactivate studio
    public fun deactivate_studio(studio: &mut Studio) {
        studio.is_active = false;
    }

    /// Activate studio
    public fun activate_studio(studio: &mut Studio) {
        studio.is_active = true;
    }

    /// Get studio name
    public fun get_studio_name(studio: &Studio): String {
        studio.name
    }

    /// Get studio owner
    public fun get_studio_owner(studio: &Studio): address {
        studio.owner
    }
}