use std::fmt::Error;

trait Serialize {
    fn serialize(&self) -> Vec<u8>;
}

trait Deserialize {
    fn deserialize(v: Vec<u8>) -> Result<Self, Error>
    where
        Self: Sized;
}

#[derive(Debug)]
struct Swap {
    qty_1: u32,
    qty_2: u32,
}

impl Serialize for Swap {
    fn serialize(&self) -> Vec<u8> {
        let mut v = Vec::new();
        v.extend_from_slice(&self.qty_1.to_le_bytes());
        v.extend_from_slice(&self.qty_2.to_le_bytes());
        v
    }
}

impl Deserialize for Swap {
    fn deserialize(v: Vec<u8>) -> Result<Self, Error> {
        if v.len() != 8 {
            return Err(Error);
        }

        let qty_1 = u32::from_le_bytes(v[0..4].try_into().map_err(|_| Error)?);
        let qty_2 = u32::from_le_bytes(v[4..8].try_into().map_err(|_| Error)?);
        Ok(Swap { qty_1, qty_2 })
    }
}

fn main() -> Result<(), Error> {
    let swap = Swap {
        qty_1: 100,
        qty_2: 200,
    };
    let serialized_data = swap.serialize();

    // Print the serialized data for demonstration
    println!("Serialized Swap: {:?}", serialized_data);

    match Swap::deserialize(serialized_data) {
        Ok(deserialized_swap) => {
            println!("Deserialized Swap: {:?}", deserialized_swap);
        }
        Err(e) => {
            eprintln!("Error during deserialization: {:?}", e);
        }
    }

    Ok(())
}
