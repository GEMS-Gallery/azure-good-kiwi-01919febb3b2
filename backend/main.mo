import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayerEntries : [(Nat, TaxPayer)] = [];

  // Initialize the HashMap with the stable variable
  let taxPayers = HashMap.fromIter<Nat, TaxPayer>(taxPayerEntries.vals(), 0, Nat.equal, Nat.hash);

  // Create a new TaxPayer record
  public func createTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async Result.Result<(), Text> {
    switch (taxPayers.get(tid)) {
      case (null) {
        let newTaxPayer : TaxPayer = {
          tid = tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxPayers.put(tid, newTaxPayer);
        #ok(())
      };
      case (?_) {
        #err("TaxPayer with TID " # Nat.toText(tid) # " already exists")
      };
    }
  };

  // Get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for a TaxPayer record by TID
  public query func getTaxPayerByTID(tid: Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Update an existing TaxPayer record
  public func updateTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async Result.Result<(), Text> {
    switch (taxPayers.get(tid)) {
      case (null) {
        #err("TaxPayer with TID " # Nat.toText(tid) # " not found")
      };
      case (?_) {
        let updatedTaxPayer : TaxPayer = {
          tid = tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxPayers.put(tid, updatedTaxPayer);
        #ok(())
      };
    }
  };

  // System functions for upgrades
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayerEntries := [];
  };
}
