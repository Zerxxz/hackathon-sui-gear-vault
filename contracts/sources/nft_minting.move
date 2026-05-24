module gear_vault::nft_minting {
    use std::string::String;
    use std::vector;
    use std::option;
    use sui::object::{UID, ID};
    use sui::tx_context::TxContext;
    use sui::table::{Table, new, add, borrow, contains, remove};
    use sui::object;
    use std::string;

    /// Rarity constants
    const RARITY_COMMON: u8 = 1;
    const RARITY_RARE: u8 = 2;
    const RARITY_EPIC: u8 = 3;
    const RARITY_LEGENDARY: u8 = 4;

    /// GearNFT - The actual NFT that players own
    struct GearNFT has key, store {
        id: UID,
        name: String,
        description: String,
        rarity: u8,
        attack: u32,
        defense: u32,
        speed: u32,
        luck: u32,
        metadata_uri: String, // Walrus blob ID
        image_url: String,
        studio_id: address,
        owner: address,
        minted_at: u64,
    }

    /// NFT Registry - Tracks all minted NFTs
    struct NFTRegistry has key, store {
        id: UID,
        nfts: Table<ID, GearNFT>,
        owner_to_nfts: Table<address, vector<ID>>,
        mint_counter: u64,
    }

    /// Initialize the NFT registry
    fun init(ctx: &mut TxContext) {
        transfer::share_object(NFTRegistry {
            id: object::new(ctx),
            nfts: new(ctx),
            owner_to_nfts: new(ctx),
            mint_counter: 0,
        });
    }

    /// Mint a new GearNFT
    public fun mint_item(
        registry: &mut NFTRegistry,
        name: String,
        description: String,
        rarity: u8,
        attack: u32,
        defense: u32,
        speed: u32,
        luck: u32,
        metadata_uri: String,
        image_url: String,
        studio_id: address,
        ctx: &mut TxContext
    ): GearNFT {
        let sender = tx_context::sender(ctx);
        
        let nft = GearNFT {
            id: object::new(ctx),
            name,
            description,
            rarity,
            attack,
            defense,
            speed,
            luck,
            metadata_uri,
            image_url,
            studio_id,
            owner: sender,
            minted_at: tx_context::epoch(ctx),
        };

        let nft_id = object::id(&nft);
        
        // Add to global registry
        registry.nfts.add(nft_id, nft);
        
        // Update owner mapping
        if (!registry.owner_to_nfts.contains(sender)) {
            registry.owner_to_nfts.add(sender, vector::empty());
        };
        
        vector::push_back(
            registry.owner_to_nfts.borrow_mut(sender),
            nft_id
        );
        
        registry.mint_counter = registry.mint_counter + 1;
        
        nft_id
    }

    /// Transfer NFT to another address
    public fun transfer_item(registry: &mut NFTRegistry, nft_id: ID, to: address, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        
        // Get NFT
        let nft = registry.nfts.borrow_mut(nft_id);
        
        // Check ownership
        assert!(nft.owner == sender, 0);
        
        // Update owner
        nft.owner = to;
        
        // Update owner mapping
        // Remove from sender's list
        let sender_nfts = registry.owner_to_nfts.borrow_mut(sender);
        let i = 0;
        let len = vector::length(sender_nfts);
        
        while (i < len) {
            if (*vector::borrow(sender_nfts, i) == nft_id) {
                vector::remove(sender_nfts, i);
                break;
            };
            i = i + 1;
        };
        
        // Add to recipient's list
        if (!registry.owner_to_nfts.contains(to)) {
            registry.owner_to_nfts.add(to, vector::empty());
        };
        
        vector::push_back(
            registry.owner_to_nfts.borrow_mut(to),
            nft_id
        );
    }

    /// Burn an NFT (destroy it)
    public fun burn_item(registry: &mut NFTRegistry, nft_id: ID, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        
        // Verify ownership
        let nft = registry.nfts.borrow(nft_id);
        assert!(nft.owner == sender, 0);
        
        // Remove from owner mapping
        let sender_nfts = registry.owner_to_nfts.borrow_mut(sender);
        let i = 0;
        let len = vector::length(sender_nfts);
        
        while (i < len) {
            if (*vector::borrow(sender_nfts, i) == nft_id) {
                vector::remove(sender_nfts, i);
                break;
            };
            i = i + 1;
        };
        
        // Remove from global registry
        registry.nfts.remove(nft_id);
    }

    /// Get NFT by ID
    public fun get_nft(registry: &NFTRegistry, nft_id: ID): &GearNFT {
        registry.nfts.borrow(nft_id)
    }

    /// Get owner's NFTs
    public fun get_nfts_by_owner(registry: &NFTRegistry, owner: address): vector<ID> {
        if (registry.owner_to_nfts.contains(owner)) {
            *registry.owner_to_nfts.borrow(owner)
        } else {
            vector::empty()
        }
    }

    /// Get total minted count
    public fun get_total_minted(registry: &NFTRegistry): u64 {
        registry.mint_counter
    }

    /// Calculate NFT power score
    public fun calculate_power(nft: &GearNFT): u32 {
        nft.attack + nft.defense + nft.speed + nft.luck
    }

    /// Get rarity string
    public fun get_rarity_string(rarity: u8): String {
        if (rarity == RARITY_COMMON) { string::utf8(b"Common") }
        else if (rarity == RARITY_RARE) { string::utf8(b"Rare") }
        else if (rarity == RARITY_EPIC) { string::utf8(b"Epic") }
        else if (rarity == RARITY_LEGENDARY) { string::utf8(b"Legendary") }
        else { string::utf8(b"Unknown") }
    }
}