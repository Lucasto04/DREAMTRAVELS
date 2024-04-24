import { MongoClient, ObjectId } from 'mongodb';
const uri = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(uri);

async function getCollection() {
  await client.connect();
  return client.db("travels").collection("viaggi"); 
}

export async function aggiornaViaggio(req, res) {
  try {
    console.log('Aggiornamento viaggio con ID:', req.params.id); 
    console.log('Dati ricevuti per l\'aggiornamento:', req.body); 

    const collection = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Nessun viaggio aggiornato, controlla l\'ID' });
    }
    res.json({ message: 'Viaggio aggiornato con successo', result });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del viaggio:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del viaggio', error });
  } finally {
    await client.close();
  }
}
export async function cancellaViaggio(req, res) {
  try {
    console.log('Tentativo di cancellazione viaggio con ID:', req.params.id);  
    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      console.log('Nessun viaggio trovato con l\'ID specificato per la cancellazione:', req.params.id);
      return res.status(404).json({ message: 'Nessun viaggio trovato con l\'ID specificato' });
    }
    console.log('Viaggio cancellato con successo', result);
    res.json({ message: 'Viaggio cancellato con successo' });
  } catch (error) {
    console.error('Errore durante la cancellazione del viaggio:', error);
    res.status(500).json({ message: 'Errore durante la cancellazione del viaggio', error });
  } finally {
    await client.close();
  }
}

export async function chiamaAutenticata(req, res) {
  try {
    console.log('Inizio recupero dei viaggi dal database');
    const collection = await getCollection();
    const books = await collection.find({}).toArray();
    console.log('Viaggi recuperati con successo');
    res.json(books);
  } catch (error) {
    console.error('Errore durante il recupero dei viaggi:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei viaggi', error });
  } finally {
    await client.close();
  }
}

export async function nuovoViaggio(req, res) {
  try {
    console.log('Tentativo di inserimento di un nuovo viaggio:', req.body);  
    const collection = await getCollection();
    const result = await collection.insertOne(req.body);
    console.log('Nuovo viaggio inserito con successo', result);
    res.json({ message: 'Viaggio inserito con successo', result });
  } catch (error) {
    console.error('Errore durante l\'inserimento di un nuovo viaggio:', error);
    res.status(500).json({ message: 'Errore durante l\'inserimento di un nuovo viaggio', error });
  } finally {
    await client.close();
  }
}
