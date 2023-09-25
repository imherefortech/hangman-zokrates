use dep::std;

fn main(word: str<16>, hash: pub [u8; 32], symbol: pub u8) -> pub [bool; 16] {
    let word_bytes = word.as_bytes();
    let computed_hash = std::hash::sha256(word_bytes);

    assert(hash == computed_hash);

    let mut result: [bool; 16] = [false; 16];

    for i in 0..16 {
        let match = word_bytes[i] == symbol;
        result[i] = match;
    }

    result
}

#[test]
fn test_space() {
    let result = main(
        "ethereum        ",
        [141, 204, 231, 111, 154, 67, 156, 82, 85, 132, 189, 165, 148, 35, 211, 81, 131, 222, 159, 226, 228, 71, 147, 94, 30, 188, 145, 168, 123, 225, 117, 224],
        0x20); // empty space

    assert(result == [false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true]);
}

#[test]
fn test_existing_letter() {
    let result = main(
        "ethereum        ",
        [141, 204, 231, 111, 154, 67, 156, 82, 85, 132, 189, 165, 148, 35, 211, 81, 131, 222, 159, 226, 228, 71, 147, 94, 30, 188, 145, 168, 123, 225, 117, 224],
        101); // 'e'

    assert(result == [true, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false]);
}

#[test]
fn test_missing_letter() {
    let result = main(
        "ethereum        ",
        [141, 204, 231, 111, 154, 67, 156, 82, 85, 132, 189, 165, 148, 35, 211, 81, 131, 222, 159, 226, 228, 71, 147, 94, 30, 188, 145, 168, 123, 225, 117, 224],
        86); // 'v'

    assert(result == [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
}
