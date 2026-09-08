# Código Comentado (JSDoc y Buenas Prácticas)

Para cumplir con la rúbrica sobre código comentado exhaustivamente, el código entregado fue documentado usando la sintaxis **JSDoc**.

## Buenas Prácticas Implementadas

1. **Descripciones a nivel de Clase:**
   Todos los servicios y componentes (ej. `@Injectable` y `@Component`) tienen un comentario encima que explica su propósito global en el módulo.

2. **Tipado Estricto de Entradas y Salidas:**
   Métodos como `enqueueRequest(request: Omit<QueuedRequest, 'id' | 'timestamp'>)` dejan claro qué debe mandarse y qué se omitirá.

3. **Etiquetas `@param` y `@returns`:**
   Implementadas en funciones clave. Ejemplo del `OfflineService`:
   ```typescript
   /**
    * Método público usado por otros servicios de la app para intentar enviar datos.
    * @param url Endpoint
    * @param method Verbo HTTP
    * @param body Payload
    */
   ```

4. **Comentarios Inline para Lógica Crítica:**
   Se usan comentarios regulares `//` para explicar pasos funcionales dentro de las promesas, como el inicializador de `NetworkListener` o la prevención de concurrencia `isSyncing` durante la sincronización.
